#!/usr/bin/env node

/**
 * Script para migrar resultados desde API pública a nuestra BD histórica
 * Uso: node scripts/migrar-resultados.js
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración
const API_URL = 'https://icfes-server.vercel.app/consulta';
const DB_PATH = join(__dirname, '../data/resultados-historicos.json');

// Lista de documentos para migrar (agregar más según necesidad)
const DOCUMENTOS_PARA_MIGRAR = [
  { document: '1234567890', young: true, born: '15/03/2005' },
  { document: '9876543210', young: false, born: '22/07/2004' },
  { document: '1111111111', young: false, born: '10/12/2003' },
  // Agregar más documentos aquí...
];

async function consultarAPI(documento) {
  try {
    console.log(`🔍 Consultando API para documento: ${documento.document}`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(documento)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status && data.estudiante && data.examenes) {
      console.log(`✅ Datos obtenidos para: ${data.estudiante}`);
      return {
        documento: documento.document,
        tipoDocumento: documento.young ? 'TI' : 'CC',
        fechaNacimiento: documento.born,
        estudiante: data.estudiante,
        examenes: data.examenes
      };
    }

    return null;
  } catch (error) {
    console.error(`❌ Error consultando ${documento.document}:`, error.message);
    return null;
  }
}

async function cargarBaseDatos() {
  try {
    const content = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Error leyendo base de datos:', error.message);
    throw error;
  }
}

async function guardarBaseDatos(db) {
  try {
    await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log('✅ Base de datos guardada exitosamente');
  } catch (error) {
    console.error('❌ Error guardando base de datos:', error.message);
    throw error;
  }
}

async function migrar() {
  console.log('🚀 Iniciando migración de resultados...\n');

  // Cargar base de datos actual
  const db = await cargarBaseDatos();
  console.log(`📊 Registros actuales: ${db.metadata.totalRecords}\n`);

  let agregados = 0;
  let actualizados = 0;
  let errores = 0;

  // Consultar cada documento
  for (const doc of DOCUMENTOS_PARA_MIGRAR) {
    const resultado = await consultarAPI(doc);
    
    if (resultado) {
      // Verificar si ya existe
      const existeIndex = db.resultados.findIndex(r => 
        r.documento.replace(/[.\-\s]/g, '') === resultado.documento.replace(/[.\-\s]/g, '')
      );

      if (existeIndex !== -1) {
        // Actualizar existente
        const existente = db.resultados[existeIndex];
        
        // Agregar exámenes nuevos
        const nuevosExamenes = resultado.examenes.filter(ne => 
          !existente.examenes.find(ee => ee.ACREGISTRO === ne.ACREGISTRO)
        );
        
        if (nuevosExamenes.length > 0) {
          db.resultados[existeIndex].examenes.push(...nuevosExamenes);
          actualizados++;
          console.log(`✏️ Actualizado: ${resultado.estudiante} (+${nuevosExamenes.length} examen(es))\n`);
        }
      } else {
        // Agregar nuevo
        db.resultados.push(resultado);
        agregados++;
        console.log(`➕ Agregado: ${resultado.estudiante}\n`);
      }
    } else {
      errores++;
    }

    // Esperar 1 segundo entre peticiones para no sobrecargar la API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Actualizar metadata
  db.metadata.totalRecords = db.resultados.length;
  db.metadata.lastUpdate = new Date().toISOString().split('T')[0];

  // Guardar base de datos
  await guardarBaseDatos(db);

  // Resumen
  console.log('\n📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(50));
  console.log(`✅ Agregados: ${agregados}`);
  console.log(`✏️ Actualizados: ${actualizados}`);
  console.log(`❌ Errores: ${errores}`);
  console.log(`📊 Total final: ${db.metadata.totalRecords}`);
  console.log('='.repeat(50));
  console.log('\n✅ Migración completada!');
}

// Ejecutar migración
migrar().catch(error => {
  console.error('\n❌ Error fatal durante migración:', error);
  process.exit(1);
});
