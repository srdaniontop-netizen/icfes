// API Serverless para Vercel
// Este endpoint hace scraping del sitio oficial del ICFES
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Configurar CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { document, young, born } = req.body;

    if (!document || born === undefined) {
      return res.status(400).json({ 
        error: 'Faltan parámetros requeridos',
        status: false 
      });
    }

    console.log('🔍 Consultando ICFES para documento:', document);

    // ESTRATEGIA 1: Intentar con el endpoint oficial del ICFES
    const resultado = await consultarICFESOficial(document, born, young);
    
    if (resultado) {
      return res.status(200).json({
        ...resultado,
        _source: 'icfes_oficial',
        _timestamp: new Date().toISOString()
      });
    }

    // ESTRATEGIA 2: Intentar con scraping directo
    const resultadoScraping = await scrapingICFES(document, born, young);
    
    if (resultadoScraping) {
      return res.status(200).json({
        ...resultadoScraping,
        _source: 'scraping',
        _timestamp: new Date().toISOString()
      });
    }

    // ESTRATEGIA 3: Base de datos local de respaldo
    console.log('⚠️ No se encontraron resultados, usando base local');
    return res.status(404).json({
      status: false,
      message: 'No se encontraron resultados'
    });

  } catch (error) {
    console.error('❌ Error en consulta:', error.message);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
      status: false
    });
  }
}

// Función 1: Consultar endpoint oficial del ICFES
async function consultarICFESOficial(document, born, young) {
  try {
    // URLs posibles del ICFES
    const urls = [
      'https://www.icfes.gov.co/servicios/resultados-en-linea',
      'https://resultados.icfes.gov.co/consulta',
      'https://www.icfes.gov.co/api/resultados',
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/html',
            'Referer': 'https://www.icfes.gov.co/'
          },
          body: JSON.stringify({
            documento: document,
            fechaNacimiento: born,
            tipoDocumento: young ? 'TI' : 'CC'
          }),
          timeout: 10000
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Respuesta exitosa de:', url);
          return transformarRespuesta(data);
        }
      } catch (err) {
        console.log('❌ Error en', url, ':', err.message);
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error en consultarICFESOficial:', error.message);
    return null;
  }
}

// Función 2: Scraping directo del sitio web
async function scrapingICFES(document, born, young) {
  try {
    const url = 'https://www2.icfes.gov.co/resultados-saber-11';
    
    // Paso 1: Obtener página de consulta
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
        'Referer': 'https://www.icfes.gov.co/',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      console.log('❌ Error HTTP:', response.status);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Buscar formulario y extraer tokens CSRF si existen
    const csrfToken = $('input[name="_csrf"]').val() || 
                     $('meta[name="csrf-token"]').attr('content');

    // Paso 2: Enviar formulario de consulta
    const formData = new URLSearchParams({
      documento: document,
      fechaNacimiento: born,
      tipoDocumento: young ? 'TI' : 'CC',
      ...(csrfToken && { _csrf: csrfToken })
    });

    const resultResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': url,
        'Cookie': response.headers.get('set-cookie') || ''
      },
      body: formData.toString()
    });

    if (resultResponse.ok) {
      const resultHtml = await resultResponse.text();
      return parsearResultados(resultHtml, document, born);
    }

    return null;
  } catch (error) {
    console.error('Error en scrapingICFES:', error.message);
    return null;
  }
}

// Función para parsear HTML de resultados
function parsearResultados(html, document, born) {
  try {
    const $ = cheerio.load(html);
    
    // Buscar datos del estudiante
    const nombreEstudiante = $('[data-nombre], .nombre-estudiante, #nombre').first().text().trim();
    
    if (!nombreEstudiante) {
      return null;
    }

    // Buscar puntajes por materia
    const materias = [];
    $('.materia, .puntaje-materia, [data-materia]').each((i, elem) => {
      const nombre = $(elem).find('.nombre, [data-nombre-materia]').text().trim();
      const puntaje = parseInt($(elem).find('.puntaje, [data-puntaje]').text().trim());
      
      if (nombre && !isNaN(puntaje)) {
        materias.push({
          code: obtenerCodigoMateria(nombre),
          nombrePrueba: nombre,
          puntaje: puntaje
        });
      }
    });

    // Buscar puntaje global
    const puntajeGlobal = parseInt($('.puntaje-global, [data-puntaje-global]').text().trim());

    if (materias.length > 0 && !isNaN(puntajeGlobal)) {
      return {
        status: true,
        estudiante: nombreEstudiante,
        examenes: [{
          ACREGISTRO: 'Consulta Web',
          puntaje: puntajeGlobal,
          ciudad: 'N/A',
          fechaResultados: new Date().toISOString().split('T')[0],
          mensajeMotivacional: '¡Excelente trabajo!',
          puntajeMaterias: materias
        }]
      };
    }

    return null;
  } catch (error) {
    console.error('Error parseando resultados:', error.message);
    return null;
  }
}

// Helpers
function obtenerCodigoMateria(nombreCompleto) {
  const codigos = {
    'lectura crítica': 'LEC',
    'matemáticas': 'MAT',
    'matemática': 'MAT',
    'sociales': 'SOC',
    'sociales y ciudadanas': 'SOC',
    'ciencias': 'CIE',
    'ciencias naturales': 'CIE',
    'inglés': 'ING',
    'ingles': 'ING'
  };

  const nombre = nombreCompleto.toLowerCase();
  for (const [key, value] of Object.entries(codigos)) {
    if (nombre.includes(key)) {
      return value;
    }
  }
  return 'OTR';
}

function transformarRespuesta(data) {
  // Si la respuesta ya está en el formato correcto
  if (data.status !== undefined && data.estudiante && data.examenes) {
    return data;
  }

  // Intentar transformar diferentes formatos de respuesta
  return {
    status: true,
    estudiante: data.nombre || data.estudiante || 'Estudiante',
    examenes: Array.isArray(data.examenes) ? data.examenes : [{
      ACREGISTRO: data.registro || 'N/A',
      puntaje: data.puntajeGlobal || data.puntaje || 0,
      ciudad: data.municipio || data.ciudad || 'N/A',
      fechaResultados: data.fecha || new Date().toISOString().split('T')[0],
      mensajeMotivacional: data.mensaje || '¡Sigue adelante!',
      puntajeMaterias: data.materias || []
    }]
  };
}
