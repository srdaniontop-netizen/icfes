// Base de datos simulada de resultados
// En producción, esto se reemplazaría con llamadas a la API oficial del ICFES
const resultadosDB = {
    'CC-1234567890-2005-03-15': {
        nombre: 'MARÍA ALEJANDRA GARCÍA LÓPEZ',
        tipoDocumento: 'CC',
        numeroDocumento: '1234567890',
        fechaNacimiento: '2005-03-15',
        tipoExamen: 'Saber 11°',
        periodo: '2023-2',
        fechaPresentacion: '2023-08-15',
        colegioNombre: 'COLEGIO SAN FRANCISCO DE ASÍS',
        colegioMunicipio: 'BOGOTÁ D.C.',
        puntajeGlobal: 387,
        puestoGlobal: 1523,
        puestoDepartamental: 342,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 78, nivel: 'superior', percentil: 95 },
            { nombre: 'Matemáticas', puntaje: 75, nivel: 'alto', percentil: 88 },
            { nombre: 'Sociales y Ciudadanas', puntaje: 72, nivel: 'alto', percentil: 85 },
            { nombre: 'Ciencias Naturales', puntaje: 80, nivel: 'superior', percentil: 92 },
            { nombre: 'Inglés', puntaje: 82, nivel: 'superior', percentil: 94 }
        ]
    },
    'TI-9876543210-2006-07-22': {
        nombre: 'JUAN SEBASTIÁN RODRÍGUEZ MARTÍNEZ',
        tipoDocumento: 'TI',
        numeroDocumento: '9876543210',
        fechaNacimiento: '2006-07-22',
        tipoExamen: 'Saber 11°',
        periodo: '2024-1',
        fechaPresentacion: '2024-04-20',
        colegioNombre: 'INSTITUCIÓN EDUCATIVA DISTRITAL',
        colegioMunicipio: 'MEDELLÍN',
        puntajeGlobal: 342,
        puestoGlobal: 4567,
        puestoDepartamental: 823,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 68, nivel: 'medio', percentil: 72 },
            { nombre: 'Matemáticas', puntaje: 70, nivel: 'alto', percentil: 78 },
            { nombre: 'Sociales y Ciudadanas', puntaje: 65, nivel: 'medio', percentil: 68 },
            { nombre: 'Ciencias Naturales', puntaje: 72, nivel: 'alto', percentil: 80 },
            { nombre: 'Inglés', puntaje: 67, nivel: 'medio', percentil: 70 }
        ]
    },
    'CC-1111111111-1998-12-10': {
        nombre: 'ANDREA CAROLINA PÉREZ HERNÁNDEZ',
        tipoDocumento: 'CC',
        numeroDocumento: '1111111111',
        fechaNacimiento: '1998-12-10',
        tipoExamen: 'Saber Pro',
        periodo: '2023-2',
        fechaPresentacion: '2023-11-12',
        universidadNombre: 'UNIVERSIDAD NACIONAL DE COLOMBIA',
        programaAcademico: 'INGENIERÍA DE SISTEMAS',
        puntajeGlobal: 425,
        puestoGlobal: 892,
        puestoPrograma: 45,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 85, nivel: 'superior', percentil: 96 },
            { nombre: 'Razonamiento Cuantitativo', puntaje: 88, nivel: 'superior', percentil: 98 },
            { nombre: 'Competencias Ciudadanas', puntaje: 82, nivel: 'superior', percentil: 94 },
            { nombre: 'Comunicación Escrita', puntaje: 86, nivel: 'superior', percentil: 97 },
            { nombre: 'Inglés', puntaje: 84, nivel: 'superior', percentil: 95 }
        ]
    },
    'CC-52123456-2005-05-20': {
        nombre: 'CARLOS ANDRÉS LÓPEZ TORRES',
        tipoDocumento: 'CC',
        numeroDocumento: '52123456',
        fechaNacimiento: '2005-05-20',
        tipoExamen: 'Saber 11°',
        periodo: '2023-1',
        fechaPresentacion: '2023-03-18',
        colegioNombre: 'COLEGIO MAYOR DE SAN BARTOLOMÉ',
        colegioMunicipio: 'BOGOTÁ D.C.',
        puntajeGlobal: 395,
        puestoGlobal: 980,
        puestoDepartamental: 245,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 80, nivel: 'superior', percentil: 93 },
            { nombre: 'Matemáticas', puntaje: 82, nivel: 'superior', percentil: 95 },
            { nombre: 'Sociales y Ciudadanas', puntaje: 77, nivel: 'alto', percentil: 90 },
            { nombre: 'Ciencias Naturales', puntaje: 78, nivel: 'alto', percentil: 91 },
            { nombre: 'Inglés', puntaje: 78, nivel: 'alto', percentil: 89 }
        ]
    },
    'TI-1098765432-2007-11-30': {
        nombre: 'SOFÍA VALENTINA RAMÍREZ CASTRO',
        tipoDocumento: 'TI',
        numeroDocumento: '1098765432',
        fechaNacimiento: '2007-11-30',
        tipoExamen: 'Saber 11°',
        periodo: '2025-2',
        fechaPresentacion: '2025-09-14',
        colegioNombre: 'GIMNASIO MODERNO',
        colegioMunicipio: 'BOGOTÁ D.C.',
        puntajeGlobal: 410,
        puestoGlobal: 567,
        puestoDepartamental: 123,
        materias: [
            { nombre: 'Lectura Crítica', puntaje: 85, nivel: 'superior', percentil: 97 },
            { nombre: 'Matemáticas', puntaje: 83, nivel: 'superior', percentil: 95 },
            { nombre: 'Sociales y Ciudadanas', puntaje: 81, nivel: 'superior', percentil: 94 },
            { nombre: 'Ciencias Naturales', puntaje: 82, nivel: 'superior', percentil: 95 },
            { nombre: 'Inglés', puntaje: 79, nivel: 'alto', percentil: 92 }
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
        fechaNacimiento: document.getElementById('fechaNacimiento').value
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
    
    if (!datos.fechaNacimiento) {
        mostrarError('Por favor ingresa tu fecha de nacimiento');
        return false;
    }
    
    // Validar formato de fecha
    const fechaNac = new Date(datos.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    
    if (edad < 15 || edad > 80) {
        mostrarError('La fecha de nacimiento no es válida');
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
    const clave = `${datos.tipoDocumento}-${datos.numeroDocumento}-${datos.fechaNacimiento}`;
    return resultadosDB[clave] || null;
}

// Mostrar resultados en la página
function mostrarResultados(resultado) {
    // Actualizar información del estudiante
    document.getElementById('nombreEstudiante').textContent = resultado.nombre;
    document.getElementById('documentoEstudiante').textContent = 
        `${resultado.tipoDocumento}: ${resultado.numeroDocumento}`;
    
    // Información específica según tipo de examen
    let infoExamen = `${resultado.tipoExamen} - Período ${resultado.periodo}`;
    if (resultado.colegioNombre) {
        infoExamen += `<br><small style="font-size: 0.85em; color: #6c757d;">${resultado.colegioNombre} - ${resultado.colegioMunicipio}</small>`;
    } else if (resultado.universidadNombre) {
        infoExamen += `<br><small style="font-size: 0.85em; color: #6c757d;">${resultado.universidadNombre}<br>${resultado.programaAcademico}</small>`;
    }
    document.getElementById('examenInfo').innerHTML = infoExamen;
    
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
        ${materia.percentil ? `<div class="materia-percentil">Percentil: ${materia.percentil}</div>` : ''}
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

// Establecer fecha máxima para el campo de fecha de nacimiento
document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('fechaNacimiento');
    const hoy = new Date();
    const hace15anos = new Date(hoy.getFullYear() - 15, hoy.getMonth(), hoy.getDate());
    const hace80anos = new Date(hoy.getFullYear() - 80, hoy.getMonth(), hoy.getDate());
    
    fechaInput.max = hace15anos.toISOString().split('T')[0];
    fechaInput.min = hace80anos.toISOString().split('T')[0];
});

// Auto-completar para pruebas de desarrollo
// Esta función solo debe estar en desarrollo, no en producción
function autocompletarParaPrueba() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%c🔧 MODO DESARROLLO', 'color: #0066cc; font-size: 14px; font-weight: bold;');
        console.log('%cDatos de prueba disponibles:', 'color: #666; font-size: 12px;');
        console.log('%c1. CC: 1234567890, Fecha: 2005-03-15 (Saber 11°)', 'color: #28a745; font-size: 11px;');
        console.log('%c2. TI: 9876543210, Fecha: 2006-07-22 (Saber 11°)', 'color: #28a745; font-size: 11px;');
        console.log('%c3. CC: 1111111111, Fecha: 1998-12-10 (Saber Pro)', 'color: #28a745; font-size: 11px;');
        console.log('%c4. CC: 52123456, Fecha: 2005-05-20 (Saber 11°)', 'color: #28a745; font-size: 11px;');
        console.log('%c5. TI: 1098765432, Fecha: 2007-11-30 (Saber 11°)', 'color: #28a745; font-size: 11px;');
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
// Esta función intenta conectar con el sitio oficial y usa fallback si falla
async function consultarAPIReal(datos) {
    /*
    ESTRATEGIA DE FALLBACK:
    1. Intentar consultar el sitio oficial del ICFES
    2. Si falla (timeout, error de red, servidor caído), usar base de datos local
    3. Mostrar advertencia al usuario sobre el origen de los datos
    */
    
    // URL de la API oficial del ICFES (cuando esté disponible)
    const apiUrlOficial = 'https://www.icfes.gov.co/api/resultados'; // URL de ejemplo
    
    try {
        // Intentar consultar la API oficial con timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(apiUrlOficial, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo_documento: datos.tipoDocumento,
                numero_documento: datos.numeroDocumento,
                fecha_nacimiento: datos.fechaNacimiento
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Resultados obtenidos del servidor oficial ICFES');
            return resultado;
        }
        
    } catch (error) {
        // Si hay error de red o timeout, usar base de datos local
        console.warn('⚠️ Servidor oficial no disponible. Usando sistema de respaldo local.');
        console.error('Detalles del error:', error.message);
    }
    
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
