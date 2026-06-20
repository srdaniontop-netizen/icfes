// Base de datos simulada de resultados
// En producción, esto se reemplazaría con llamadas a la API oficial del ICFES
const resultadosDB = {
    'CC-1234567890-SABER11-2026-1': {
        nombre: 'MARÍA ALEJANDRA GARCÍA LÓPEZ',
        tipoDocumento: 'CC',
        numeroDocumento: '1234567890',
        tipoExamen: 'Saber 11°',
        periodo: '2026-1',
        puntajeGlobal: 387,
        puestoGlobal: 1523,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 78, nivel: 'superior' },
            { nombre: 'Matemáticas', puntaje: 75, nivel: 'alto' },
            { nombre: 'Sociales y Ciudadanas', puntaje: 72, nivel: 'alto' },
            { nombre: 'Ciencias Naturales', puntaje: 80, nivel: 'superior' },
            { nombre: 'Inglés', puntaje: 82, nivel: 'superior' }
        ]
    },
    'TI-9876543210-SABER11-2025-2': {
        nombre: 'JUAN SEBASTIÁN RODRÍGUEZ MARTÍNEZ',
        tipoDocumento: 'TI',
        numeroDocumento: '9876543210',
        tipoExamen: 'Saber 11°',
        periodo: '2025-2',
        puntajeGlobal: 342,
        puestoGlobal: 4567,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 68, nivel: 'medio' },
            { nombre: 'Matemáticas', puntaje: 70, nivel: 'alto' },
            { nombre: 'Sociales y Ciudadanas', puntaje: 65, nivel: 'medio' },
            { nombre: 'Ciencias Naturales', puntaje: 72, nivel: 'alto' },
            { nombre: 'Inglés', puntaje: 67, nivel: 'medio' }
        ]
    },
    'CC-1111111111-SABERPRO-2025-1': {
        nombre: 'ANDREA CAROLINA PÉREZ HERNÁNDEZ',
        tipoDocumento: 'CC',
        numeroDocumento: '1111111111',
        tipoExamen: 'Saber Pro',
        periodo: '2025-1',
        puntajeGlobal: 425,
        puestoGlobal: 892,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 85, nivel: 'superior' },
            { nombre: 'Razonamiento Cuantitativo', puntaje: 88, nivel: 'superior' },
            { nombre: 'Competencias Ciudadanas', puntaje: 82, nivel: 'superior' },
            { nombre: 'Comunicación Escrita', puntaje: 86, nivel: 'superior' },
            { nombre: 'Inglés', puntaje: 84, nivel: 'superior' }
        ]
    }
};

// Elementos del DOM
const consultaForm = document.getElementById('consultaForm');
const errorMessage = document.getElementById('errorMessage');
const resultadosSection = document.getElementById('resultadosSection');
const btnConsultar = document.querySelector('.btn-consultar');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// Event Listeners
consultaForm.addEventListener('submit', handleSubmit);

// Función principal para manejar el envío del formulario
async function handleSubmit(e) {
    e.preventDefault();
    
    // Ocultar mensajes previos
    ocultarError();
    ocultarResultados();
    
    // Obtener valores del formulario
    const formData = {
        tipoDocumento: document.getElementById('tipoDocumento').value,
        numeroDocumento: document.getElementById('numeroDocumento').value,
        tipoExamen: document.getElementById('tipoExamen').value,
        periodo: document.getElementById('periodo').value
    };
    
    // Validar datos
    if (!validarFormulario(formData)) {
        return;
    }
    
    // Mostrar estado de carga
    mostrarCargando();
    
    // Simular llamada a API (en producción, aquí iría la llamada real)
    try {
        await simularLlamadaAPI();
        const resultado = buscarResultado(formData);
        
        if (resultado) {
            mostrarResultados(resultado);
        } else {
            mostrarError('No se encontraron resultados para los datos ingresados. Por favor verifica la información e intenta nuevamente.');
        }
    } catch (error) {
        mostrarError('Error al consultar los resultados. Por favor intenta más tarde.');
        console.error('Error:', error);
    } finally {
        ocultarCargando();
    }
}

// Validar formulario
function validarFormulario(datos) {
    if (!datos.tipoDocumento) {
        mostrarError('Por favor selecciona el tipo de documento');
        return false;
    }
    
    if (!datos.numeroDocumento) {
        mostrarError('Por favor ingresa el número de documento');
        return false;
    }
    
    if (!/^\d+$/.test(datos.numeroDocumento)) {
        mostrarError('El número de documento solo debe contener dígitos');
        return false;
    }
    
    if (!datos.tipoExamen) {
        mostrarError('Por favor selecciona el tipo de examen');
        return false;
    }
    
    if (!datos.periodo) {
        mostrarError('Por favor selecciona el período de aplicación');
        return false;
    }
    
    return true;
}

// Simular llamada a API con delay
function simularLlamadaAPI() {
    return new Promise(resolve => {
        setTimeout(resolve, 1500); // Simular latencia de red
    });
}

// Buscar resultado en la base de datos simulada
function buscarResultado(datos) {
    const clave = `${datos.tipoDocumento}-${datos.numeroDocumento}-${datos.tipoExamen}-${datos.periodo}`;
    return resultadosDB[clave] || null;
}

// Mostrar resultados en la página
function mostrarResultados(resultado) {
    // Actualizar información del estudiante
    document.getElementById('nombreEstudiante').textContent = resultado.nombre;
    document.getElementById('documentoEstudiante').textContent = 
        `${resultado.tipoDocumento}: ${resultado.numeroDocumento}`;
    document.getElementById('examenInfo').textContent = 
        `${resultado.tipoExamen} - Período ${resultado.periodo}`;
    
    // Actualizar puntaje global
    document.getElementById('puntajeGlobal').textContent = resultado.puntajeGlobal;
    
    // Actualizar puesto global
    document.getElementById('puestoGlobal').textContent = 
        resultado.puestoGlobal.toLocaleString('es-CO');
    
    // Generar cards de materias
    const materiasGrid = document.getElementById('materiasGrid');
    materiasGrid.innerHTML = '';
    
    resultado.materias.forEach(materia => {
        const card = crearMateriaCard(materia);
        materiasGrid.appendChild(card);
    });
    
    // Mostrar sección de resultados con animación
    resultadosSection.style.display = 'block';
    resultadosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Crear card de materia
function crearMateriaCard(materia) {
    const card = document.createElement('div');
    card.className = 'materia-card';
    
    const nivelTexto = obtenerTextoNivel(materia.nivel);
    
    card.innerHTML = `
        <div class="materia-nombre">${materia.nombre}</div>
        <div class="materia-puntaje">${materia.puntaje}</div>
        <span class="materia-nivel nivel-${materia.nivel}">${nivelTexto}</span>
    `;
    
    return card;
}

// Obtener texto del nivel
function obtenerTextoNivel(nivel) {
    const niveles = {
        'superior': 'Superior',
        'alto': 'Alto',
        'medio': 'Medio',
        'bajo': 'Básico'
    };
    return niveles[nivel] || nivel;
}

// Mostrar error
function mostrarError(mensaje) {
    errorMessage.querySelector('.message-text').textContent = mensaje;
    errorMessage.style.display = 'flex';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Ocultar error
function ocultarError() {
    errorMessage.style.display = 'none';
}

// Ocultar resultados
function ocultarResultados() {
    resultadosSection.style.display = 'none';
}

// Mostrar estado de carga
function mostrarCargando() {
    btnConsultar.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
}

// Ocultar estado de carga
function ocultarCargando() {
    btnConsultar.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
}

// Nueva consulta
function nuevaConsulta() {
    ocultarResultados();
    ocultarError();
    consultaForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Descargar PDF (simulado)
function descargarPDF() {
    alert('🔄 Funcionalidad de descarga en desarrollo\n\n' +
          'En la versión de producción, aquí se generará un PDF oficial con:\n' +
          '• Resultados completos del examen\n' +
          '• Información del estudiante\n' +
          '• Puntajes por competencia\n' +
          '• Firma digital del ICFES\n\n' +
          'Para implementar esta funcionalidad necesitas:\n' +
          '1. Una biblioteca de generación de PDF (ej: jsPDF, PDFKit)\n' +
          '2. Acceso a la API oficial del ICFES\n' +
          '3. Firma digital certificada');
    
    // Ejemplo de implementación básica con window.print()
    // window.print();
}

// Validación en tiempo real del número de documento
document.getElementById('numeroDocumento').addEventListener('input', function(e) {
    // Eliminar caracteres no numéricos
    this.value = this.value.replace(/\D/g, '');
});

// Auto-completar para pruebas de desarrollo
// Esta función solo debe estar en desarrollo, no en producción
function autocompletarParaPrueba() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%c🔧 MODO DESARROLLO', 'color: #0066cc; font-size: 14px; font-weight: bold;');
        console.log('%cDatos de prueba disponibles:', 'color: #666; font-size: 12px;');
        console.log('%c1. CC: 1234567890, Saber 11°, 2026-1', 'color: #28a745; font-size: 11px;');
        console.log('%c2. TI: 9876543210, Saber 11°, 2025-2', 'color: #28a745; font-size: 11px;');
        console.log('%c3. CC: 1111111111, Saber Pro, 2025-1', 'color: #28a745; font-size: 11px;');
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    autocompletarParaPrueba();
    
    // Agregar tooltips o ayuda contextual si es necesario
    agregarAyudaContextual();
});

// Agregar ayuda contextual
function agregarAyudaContextual() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Podrías agregar tooltips o mensajes de ayuda aquí
        });
    });
}

// Función para integrar con API real del ICFES
// Esta es una plantilla que debes adaptar cuando tengas acceso a la API oficial
async function consultarAPIReal(datos) {
    /*
    NOTA IMPORTANTE: Esta función es un template para cuando tengas acceso a la API oficial
    
    const apiUrl = 'https://api.icfes.gov.co/v1/resultados'; // URL de ejemplo
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TU_API_KEY_AQUI' // Si requiere autenticación
            },
            body: JSON.stringify({
                tipo_documento: datos.tipoDocumento,
                numero_documento: datos.numeroDocumento,
                tipo_examen: datos.tipoExamen,
                periodo: datos.periodo
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error('Error al consultar la API:', error);
        throw error;
    }
    */
    
    console.warn('⚠️ API real no configurada. Usando datos de demostración.');
    return null;
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
});

// Prevenir envío doble del formulario
let isSubmitting = false;

consultaForm.addEventListener('submit', async function(e) {
    if (isSubmitting) {
        e.preventDefault();
        return;
    }
    isSubmitting = true;
    
    // El resto del proceso de envío
    setTimeout(() => {
        isSubmitting = false;
    }, 2000);
});

// Función para exportar datos (útil para integraciones futuras)
function exportarResultados(formato = 'json') {
    const resultadoActual = {
        // Capturar los datos mostrados en pantalla
        nombre: document.getElementById('nombreEstudiante')?.textContent,
        documento: document.getElementById('documentoEstudiante')?.textContent,
        examen: document.getElementById('examenInfo')?.textContent,
        puntajeGlobal: document.getElementById('puntajeGlobal')?.textContent,
        puesto: document.getElementById('puestoGlobal')?.textContent
    };
    
    if (formato === 'json') {
        return JSON.stringify(resultadoActual, null, 2);
    }
    
    return resultadoActual;
}

// Exponer funciones útiles al objeto window para debugging
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.icfesDebug = {
        resultadosDB,
        exportarResultados,
        consultarAPIReal
    };
}
