# 🎓 Sistema de Consulta de Resultados ICFES

Sistema web moderno para consultar resultados oficiales de exámenes ICFES (Saber 11°, Saber Pro, Saber TyT, etc.)

## 📋 Descripción

Esta es una aplicación web responsive que permite a los estudiantes consultar sus resultados de exámenes ICFES de manera rápida y segura. La interfaz está diseñada siguiendo los estándares visuales del ICFES oficial.

## ✨ Características

- ✅ Interfaz moderna y profesional con colores oficiales del ICFES
- ✅ Diseño 100% responsive (móvil, tablet, desktop)
- ✅ Validación de datos en tiempo real
- ✅ Animaciones suaves y transiciones fluidas
- ✅ Visualización clara de resultados por materia
- ✅ Indicadores de nivel de desempeño por competencia
- ✅ Preparado para integración con API oficial
- ✅ Sistema de mensajes de error amigables
- ✅ Soporte para múltiples tipos de examen

## 🚀 Cómo Usar

### Instalación Local

1. **Clona o descarga este repositorio**
   ```bash
   git clone <tu-repositorio>
   cd icfes
   ```

2. **Abre el archivo `index.html` en tu navegador**
   - Simplemente haz doble clic en `index.html`
   - O arrastra el archivo a tu navegador
   - O usa un servidor local (recomendado para desarrollo)

3. **Usando un servidor local (opcional pero recomendado)**
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (http-server)
   npx http-server -p 8000
   
   # Con PHP
   php -S localhost:8000
   ```
   
   Luego visita: `http://localhost:8000`

### Uso de la Aplicación

1. **Selecciona el tipo de documento** (CC, TI, CE, PEP)
2. **Ingresa el número de documento** (solo números)
3. **Selecciona el tipo de examen** (Saber 11°, Saber Pro, etc.)
4. **Selecciona el período de aplicación**
5. **Haz clic en "Consultar Resultados"**

## 🧪 Datos de Prueba

Para probar la aplicación, usa estos datos de ejemplo:

### Ejemplo 1: Excelente Desempeño
- **Tipo de Documento:** CC
- **Número:** 1234567890
- **Tipo de Examen:** Saber 11°
- **Período:** 2026-1

### Ejemplo 2: Buen Desempeño
- **Tipo de Documento:** TI
- **Número:** 9876543210
- **Tipo de Examen:** Saber 11°
- **Período:** 2025-2

### Ejemplo 3: Excelente Desempeño (Saber Pro)
- **Tipo de Documento:** CC
- **Número:** 1111111111
- **Tipo de Examen:** Saber Pro
- **Período:** 2025-1

## 🔧 Estructura del Proyecto

```
icfes/
│
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS completos
├── script.js           # Lógica JavaScript
└── README.md           # Este archivo
```

## 🔌 Integración con API Real

### Configuración de API

Esta aplicación está preparada para conectarse con la API oficial del ICFES. Para integrarla:

1. **Obtén las credenciales de API del ICFES**
   - Contacta al ICFES para obtener acceso a su API
   - Solicita tu API Key y documentación oficial

2. **Actualiza la función `consultarAPIReal()` en `script.js`**
   
   ```javascript
   async function consultarAPIReal(datos) {
       const apiUrl = 'https://api.icfes.gov.co/v1/resultados'; // URL real
       
       try {
           const response = await fetch(apiUrl, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': 'Bearer TU_API_KEY_AQUI'
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
           
           return await response.json();
           
       } catch (error) {
           console.error('Error al consultar la API:', error);
           throw error;
       }
   }
   ```

3. **Modifica la función `handleSubmit()` para usar la API real**
   
   Reemplaza:
   ```javascript
   const resultado = buscarResultado(formData);
   ```
   
   Por:
   ```javascript
   const resultado = await consultarAPIReal(formData);
   ```

### Variables de Entorno (Recomendado)

Para mayor seguridad, usa variables de entorno:

```javascript
const API_KEY = process.env.ICFES_API_KEY;
const API_URL = process.env.ICFES_API_URL;
```

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #003875;      /* Azul principal ICFES */
    --secondary-color: #0066cc;    /* Azul secundario */
    --accent-color: #00a0e3;       /* Color de acento */
    /* ... más colores ... */
}
```

### Agregar Nuevos Tipos de Examen

En `index.html`, agrega opciones al select:

```html
<select id="tipoExamen" name="tipoExamen" required>
    <!-- ... opciones existentes ... -->
    <option value="NUEVO_EXAMEN">Nuevo Tipo de Examen</option>
</select>
```

### Modificar Materias Evaluadas

Edita el objeto `resultadosDB` en `script.js` para cambiar las materias según el tipo de examen.

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 **Móviles:** < 480px
- 📱 **Tablets:** 481px - 768px
- 💻 **Desktop:** > 769px

## 🔒 Seguridad

### Recomendaciones para Producción:

1. **HTTPS obligatorio**
   - Usa siempre HTTPS en producción
   - Obtén un certificado SSL (Let's Encrypt gratis)

2. **Validación del lado del servidor**
   - Nunca confíes solo en la validación del cliente
   - Implementa validación robusta en el backend

3. **Protección de datos**
   - No almacenes datos sensibles en localStorage
   - Implementa tokens de sesión seguros
   - Cumple con la Ley de Protección de Datos

4. **Rate Limiting**
   - Limita las consultas por IP
   - Implementa CAPTCHA si es necesario

5. **Sanitización de inputs**
   - Previene inyección SQL
   - Previene XSS (Cross-Site Scripting)

## 🐛 Debugging

### Modo Desarrollo

Abre la consola del navegador (F12) para ver:
- Datos de prueba disponibles
- Errores de validación
- Estado de las peticiones
- Variables de debug expuestas en `window.icfesDebug`

### Herramientas de Debug

```javascript
// En la consola del navegador
window.icfesDebug.resultadosDB        // Ver base de datos
window.icfesDebug.exportarResultados() // Exportar resultados actuales
```

## 🚀 Deploy a Producción

### Opción 1: GitHub Pages (Gratis)

1. Sube el código a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` → Save
4. Tu sitio estará en: `https://tu-usuario.github.io/icfes`

### Opción 2: Netlify (Gratis)

1. Arrastra la carpeta a [netlify.com/drop](https://app.netlify.com/drop)
2. O conecta tu repositorio de GitHub
3. Deploy automático en cada push

### Opción 3: Vercel (Gratis)

```bash
npm install -g vercel
cd icfes
vercel
```

### Opción 4: Servidor Tradicional

1. Sube los archivos vía FTP
2. Asegúrate de que el servidor soporte HTTPS
3. Configura el dominio y certificado SSL

## 📊 Funcionalidades Futuras

- [ ] Generación real de PDF con firma digital
- [ ] Historial de consultas (con autenticación)
- [ ] Comparativa con promedios nacionales
- [ ] Gráficos interactivos de desempeño
- [ ] Compartir resultados en redes sociales
- [ ] Modo oscuro / claro
- [ ] Soporte multiidioma (inglés)
- [ ] Notificaciones push cuando salgan resultados
- [ ] Integración con Google Analytics

## 📄 Licencia

Este proyecto es una demostración educativa. Para uso comercial o producción con datos reales del ICFES, debes obtener autorización oficial.

## 👥 Contribuir

¿Quieres mejorar este proyecto? ¡Las contribuciones son bienvenidas!

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📞 Contacto ICFES Oficial

- 🌐 Web: [www.icfes.gov.co](https://www.icfes.gov.co)
- 📞 Teléfono: 601 9156101
- 📧 Email: atencionalciudadano@icfes.gov.co
- 📍 Dirección: Calle 26 No.69-76, Torre 2, Piso 16, Bogotá

## ⚠️ Disclaimer

**IMPORTANTE:** Este es un sistema de demostración con fines educativos. Los datos mostrados son ficticios. Para consultar resultados oficiales, visita el portal oficial del ICFES: [www.icfes.gov.co](https://www.icfes.gov.co) o descarga la app oficial "Mi ICFES".

## 📝 Changelog

### v1.0.0 (2026-06-20)
- ✅ Lanzamiento inicial
- ✅ Interfaz responsive completa
- ✅ Sistema de consulta funcional
- ✅ Validación de formularios
- ✅ Visualización de resultados
- ✅ Datos de demostración

---

**Desarrollado con ❤️ para la comunidad educativa colombiana**
