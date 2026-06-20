// API para AGREGAR nuevos resultados a la base de datos histórica
// Solo accesible con API KEY por seguridad

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Verificar API Key (básico - en producción usar JWT o similar)
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.ADMIN_API_KEY || 'icfes-admin-2026';
    
    if (apiKey !== validApiKey) {
      return res.status(401).json({ 
        error: 'No autorizado',
        message: 'API Key inválida o no proporcionada'
      });
    }

    const nuevoResultado = req.body;

    // Validar datos requeridos
    if (!nuevoResultado.documento || !nuevoResultado.estudiante || !nuevoResultado.examenes) {
      return res.status(400).json({ 
        error: 'Datos incompletos',
        message: 'Se requiere: documento, estudiante, examenes'
      });
    }

    // Leer base de datos actual
    const dbPath = join(process.cwd(), 'data', 'resultados-historicos.json');
    const dbContent = await readFile(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);

    // Verificar si el documento ya existe
    const existeIndex = db.resultados.findIndex(r => 
      r.documento.replace(/[.\-\s]/g, '') === nuevoResultado.documento.replace(/[.\-\s]/g, '')
    );

    if (existeIndex !== -1) {
      // Si existe, ACTUALIZAR (agregar nuevo examen o reemplazar)
      const existente = db.resultados[existeIndex];
      
      // Agregar nuevo examen si no está duplicado
      const nuevosExamenes = nuevoResultado.examenes.filter(ne => 
        !existente.examenes.find(ee => ee.ACREGISTRO === ne.ACREGISTRO)
      );
      
      if (nuevosExamenes.length > 0) {
        db.resultados[existeIndex].examenes.push(...nuevosExamenes);
        console.log(`✅ Actualizado estudiante ${nuevoResultado.documento}: +${nuevosExamenes.length} examen(es)`);
      } else {
        return res.status(200).json({ 
          success: false,
          message: 'El resultado ya existe en la base de datos',
          estudiante: existente.estudiante
        });
      }
    } else {
      // Si NO existe, AGREGAR nuevo registro
      db.resultados.push({
        documento: nuevoResultado.documento,
        tipoDocumento: nuevoResultado.tipoDocumento || 'CC',
        fechaNacimiento: nuevoResultado.fechaNacimiento || '',
        estudiante: nuevoResultado.estudiante,
        examenes: nuevoResultado.examenes
      });
      
      console.log(`✅ Agregado nuevo estudiante: ${nuevoResultado.estudiante}`);
    }

    // Actualizar metadata
    db.metadata.totalRecords = db.resultados.length;
    db.metadata.lastUpdate = new Date().toISOString().split('T')[0];

    // Guardar base de datos actualizada
    await writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');

    return res.status(200).json({ 
      success: true,
      message: existeIndex !== -1 ? 'Resultado actualizado exitosamente' : 'Resultado agregado exitosamente',
      totalRecords: db.metadata.totalRecords,
      estudiante: nuevoResultado.estudiante
    });

  } catch (error) {
    console.error('❌ Error agregando resultado:', error);
    
    return res.status(500).json({ 
      error: 'Error del servidor',
      message: error.message
    });
  }
}
