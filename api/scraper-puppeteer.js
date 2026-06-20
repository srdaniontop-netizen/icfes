// API con Puppeteer para scraping avanzado
// Usa un navegador real para evitar bloqueos
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let browser;
  
  try {
    const { document, young, born } = req.body;

    console.log('🚀 Iniciando Puppeteer...');

    // Configurar Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Configurar user agent para parecer navegador real
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Navegar al sitio del ICFES
    const urls = [
      'https://www2.icfes.gov.co/resultados-saber-11',
      'https://www.icfes.gov.co/servicios/resultados-en-linea',
      'https://resultados.icfes.gov.co'
    ];

    let success = false;
    let resultado = null;

    for (const url of urls) {
      try {
        console.log(`📍 Intentando: ${url}`);
        
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 15000
        });

        // Esperar a que cargue el formulario
        await page.waitForSelector('input[name="documento"], input[id="documento"], input[type="text"]', {
          timeout: 5000
        });

        // Llenar formulario
        await page.type('input[name="documento"], input[id="documento"]', document);
        
        // Seleccionar tipo de documento si existe
        const tipoDocSelect = await page.$('select[name="tipoDocumento"]');
        if (tipoDocSelect) {
          await page.select('select[name="tipoDocumento"]', young ? 'TI' : 'CC');
        }

        // Llenar fecha de nacimiento
        const [day, month, year] = born.split('/');
        const fechaInput = await page.$('input[name="fechaNacimiento"], input[type="date"]');
        if (fechaInput) {
          await page.type('input[name="fechaNacimiento"], input[type="date"]', `${year}-${month}-${day}`);
        }

        // Hacer clic en botón de consulta
        await page.click('button[type="submit"], input[type="submit"], .btn-consultar');

        // Esperar resultados
        await page.waitForSelector('.resultados, .puntaje, [data-puntaje]', {
          timeout: 10000
        });

        // Extraer datos
        resultado = await page.evaluate(() => {
          const nombre = document.querySelector('[data-nombre], .nombre-estudiante')?.textContent.trim();
          const puntajeGlobal = parseInt(document.querySelector('[data-puntaje-global], .puntaje-global')?.textContent);

          const materias = [];
          document.querySelectorAll('.materia, [data-materia]').forEach(elem => {
            const nombreMateria = elem.querySelector('.nombre-materia')?.textContent.trim();
            const puntaje = parseInt(elem.querySelector('.puntaje')?.textContent);
            
            if (nombreMateria && !isNaN(puntaje)) {
              materias.push({
                nombrePrueba: nombreMateria,
                puntaje: puntaje
              });
            }
          });

          return {
            estudiante: nombre,
            puntajeGlobal: puntajeGlobal,
            materias: materias
          };
        });

        if (resultado && resultado.estudiante) {
          success = true;
          break;
        }

      } catch (err) {
        console.log(`❌ Error en ${url}:`, err.message);
        continue;
      }
    }

    await browser.close();

    if (success && resultado) {
      return res.status(200).json({
        status: true,
        estudiante: resultado.estudiante,
        examenes: [{
          ACREGISTRO: 'Consulta Puppeteer',
          puntaje: resultado.puntajeGlobal,
          ciudad: 'N/A',
          fechaResultados: new Date().toISOString().split('T')[0],
          mensajeMotivacional: '¡Excelente trabajo!',
          puntajeMaterias: resultado.materias
        }],
        _source: 'puppeteer_scraping'
      });
    }

    return res.status(404).json({
      status: false,
      message: 'No se encontraron resultados'
    });

  } catch (error) {
    console.error('❌ Error Puppeteer:', error.message);
    
    if (browser) {
      await browser.close();
    }

    return res.status(500).json({
      error: 'Error en scraping',
      details: error.message,
      status: false
    });
  }
}
