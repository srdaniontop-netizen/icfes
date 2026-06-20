const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Base de datos simulada - EN PRODUCCIÓN ESTO SERÍA UNA BASE DE DATOS REAL
const resultadosDB = require('./db.json');

// Endpoint principal para consultar resultados
app.post('/api/consultar-resultados', async (req, res) => {
    try {
        const { tipoDocumento, numeroDocumento, fechaNacimiento } = req.body;
        
        // Validar datos requeridos
        if (!tipoDocumento || !numeroDocumento || !fechaNacimiento) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }
        
        // Simular latencia de red (como si fuera consulta real)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Buscar resultado en la base de datos
        const clave = `${tipoDocumento}-${numeroDocumento}-${fechaNacimiento}`;
        const resultado = resultadosDB[clave];
        
        if (!resultado) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron resultados para los datos ingresados'
            });
        }
        
        // Log de la consulta (para monitoreo)
        console.log(`[${new Date().toISOString()}] Consulta exitosa: ${clave}`);
        
        // Retornar resultado
        return res.status(200).json({
            success: true,
            data: resultado,
            metadata: {
                timestamp: new Date().toISOString(),
                source: 'local_database'
            }
        });
        
    } catch (error) {
        console.error('Error en consulta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Endpoint de salud del servidor
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Endpoint para verificar disponibilidad del sitio oficial
app.get('/api/check-official-site', async (req, res) => {
    try {
        // Aquí iría la lógica para verificar si el sitio oficial está disponible
        // Por ahora retornamos un status simulado
        res.json({
            official_site_status: 'unavailable',
            fallback_active: true,
            message: 'Usando sistema de respaldo local'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al verificar disponibilidad'
        });
    }
});

// Endpoint para estadísticas (útil para dashboard de administración)
app.get('/api/stats', (req, res) => {
    const totalResultados = Object.keys(resultadosDB).length;
    res.json({
        total_resultados: totalResultados,
        server_time: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Servir el archivo index.html como página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🎓 SERVIDOR DE CONSULTA ICFES INICIADO');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`⏰ Hora inicio: ${new Date().toLocaleString('es-CO')}`);
    console.log(`📊 Resultados en DB: ${Object.keys(resultadosDB).length}`);
    console.log('='.repeat(50));
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});
