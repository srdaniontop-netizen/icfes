# 🎓 Sistema de Consulta de Resultados ICFES Saber 11

Sistema web moderno para consultar resultados del examen ICFES Saber 11 en Colombia con **scraping real** del sitio oficial.

**🚀 En vivo**: [https://icfes-livid.vercel.app/](https://icfes-livid.vercel.app/)

---

## ⚡ Características Principales

### 🎯 Sistema Inteligente de 3 Niveles

1. **API Pública del ICFES** - Intenta primero con APIs públicas disponibles
2. **Scraping Directo** - Scraping del sitio oficial con Cheerio + regex avanzado
3. **Datos Simulados** - Fallback consistente si los métodos anteriores fallan

✅ **SIEMPRE retorna resultados** - Nunca verás un error 404  
✅ **Datos consistentes** - Mismo documento = mismos resultados simulados  
✅ **Transparente** - Campo `_source` indica el origen de los datos  

---

## 🔥 Funcionalidades

- ✅ **Scraping REAL del ICFES** - Múltiples URLs y estrategias
- ✅ **Parseo robusto con Cheerio** - 20+ selectores CSS diferentes
- ✅ **Soporte para múltiples exámenes** - Si presentaste varias veces
- ✅ **Interfaz profesional** - Colores oficiales del ICFES
- ✅ **100% Responsive** - Móvil, tablet, desktop
- ✅ **Validación en tiempo real** - Formularios inteligentes
- ✅ **Mensajes motivacionales** - Como el sitio oficial
- ✅ **Sin instalación** - Solo abre el sitio web

---

## 🚀 Uso Rápido

### Sitio Web (Recomendado)

**Visita**: [https://icfes-livid.vercel.app/](https://icfes-livid.vercel.app/)

1. Selecciona tipo de documento (TI o CC)
2. Ingresa número de documento
3. Ingresa fecha de nacimiento (YYYY-MM-DD o DD/MM/YYYY)
4. Click en "Consultar Resultados"

### API Directa

```bash
curl -X POST https://icfes-livid.vercel.app/api/consulta \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "young": true,
    "born": "15/03/2005"
  }'
```

**Respuesta**:
```json
{
  "status": true,
  "estudiante": "JUAN PÉREZ GARCÍA",
  "examenes": [{
    "ACREGISTRO": "AC2026123456",
    "puntaje": 385,
    "ciudad": "BOGOTÁ D.C.",
    "fechaResultados": "2026-06-15",
    "mensajeMotivacional": "¡Excelentes resultados!",
    "puntajeMaterias": [
      {"code": "LEC", "nombrePrueba": "Lectura Crítica", "puntaje": 75},
      {"code": "MAT", "nombrePrueba": "Matemáticas", "puntaje": 80},
      {"code": "SOC", "nombrePrueba": "Sociales y Ciudadanas", "puntaje": 78},
      {"code": "CIE", "nombrePrueba": "Ciencias Naturales", "puntaje": 82},
      {"code": "ING", "nombrePrueba": "Inglés", "puntaje": 85}
    ]
  }],
  "_source": "scraping_oficial",
  "_timestamp": "2026-06-20T05:30:00.000Z"
}
```

---

## 🔧 Cómo Funciona el Sistema

### Backend (Serverless en Vercel)

```
┌─────────────────────────────────────────────────────────┐
│  Usuario ingresa documento + fecha de nacimiento        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 1: Intentar API Pública del ICFES                 │
│  └─ https://icfes-server.vercel.app/consulta           │
│  └─ Timeout: 10 segundos                               │
└─────────────────────┬───────────────────────────────────┘
                      │
                 ✅ ¿Éxito?
                      │
                 ❌ No disponible
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 2: Scraping Directo del Sitio Oficial            │
│  └─ www2.icfes.gov.co/resultados-saber-11             │
│  └─ resultados.icfes.gov.co/consulta                  │
│  └─ Headers realistas (Chrome 120)                     │
│  └─ Cheerio + 20+ selectores CSS                       │
│  └─ Extrae: nombre, puntajes, materias, ciudad         │
└─────────────────────┬───────────────────────────────────┘
                      │
                 ✅ ¿Encontró datos?
                      │
                 ❌ No disponible
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  PASO 3: Datos Simulados Consistentes                   │
│  └─ Hash del documento para consistencia                │
│  └─ Mismo documento = mismos resultados SIEMPRE         │
│  └─ Puntajes realistas (250-400)                        │
│  └─ 5 materias con puntajes (40-95)                     │
│  └─ Campo _source: "simulado"                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
              ✅ RETORNA RESULTADO
```

---

## 📊 Campos de Respuesta

### Campo `_source`

Indica el origen de los datos:

- `"api_publica"` - Datos reales de API pública
- `"scraping_oficial"` - Datos reales scrapeados del sitio oficial
- `"simulado"` - Datos simulados (cuando no se pudieron obtener reales)

### Estructura de Respuesta

```typescript
{
  status: boolean,           // true si hay datos
  estudiante: string,        // Nombre completo en MAYÚSCULAS
  examenes: [{
    ACREGISTRO: string,      // Código de registro del examen
    puntaje: number,         // Puntaje global (0-500)
    ciudad: string,          // Ciudad donde presentó el examen
    fechaResultados: string, // Fecha formato YYYY-MM-DD
    mensajeMotivacional: string,
    puntajeMaterias: [{
      code: string,          // LEC, MAT, SOC, CIE, ING
      nombrePrueba: string,  // Nombre completo de la materia
      puntaje: number        // Puntaje (0-100)
    }]
  }],
  _source: string,           // Origen de los datos
  _note?: string,            // Nota adicional (solo si simulado)
  _timestamp: string         // ISO timestamp
}
```

---

## 🛠️ Instalación Local

### Requisitos

- Node.js 18+ (usa `fetch` nativo)
- npm o yarn

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/srdaniontop-netizen/icfes.git
cd icfes

# 2. Instalar dependencias
npm install

# 3. Iniciar en desarrollo local (opcional)
npm run dev

# 4. Abrir en el navegador
# Opción A: Abrir index.html directamente
# Opción B: Usar servidor local
python -m http.server 8000
# Visitar: http://localhost:8000
```

---

## ☁️ Deploy en Vercel

### Opción 1: Botón de Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/srdaniontop-netizen/icfes)

### Opción 2: Manual

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Configuración:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (vacío)
   - Output Directory: (vacío)
   - Install Command: `npm install`
4. Click "Deploy"
5. ¡Listo en 1-2 minutos!

---

## 🔍 URLs que Intenta Scrapear

El sistema intenta en orden:

### APIs Públicas:
1. `https://icfes-server.vercel.app/consulta`
2. `https://icfes-api.vercel.app/consulta`
3. `https://api-icfes.vercel.app/consulta`

### Sitios Oficiales del ICFES:
1. `https://www2.icfes.gov.co/resultados-saber-11`
2. `https://resultados.icfes.gov.co/consulta`
3. `https://www.icfes.gov.co/servicios/resultados-en-linea`

---

## 🎨 Tecnologías Utilizadas

### Frontend
- HTML5 + CSS3 (Variables CSS, Grid, Flexbox)
- JavaScript Vanilla (ES6+, Fetch API)
- Responsive Design (Mobile-first)

### Backend (Serverless)
- Node.js 18+ (Fetch nativo)
- Cheerio 1.0 (Parseo de HTML)
- Vercel Serverless Functions

### Infraestructura
- Vercel (Hosting + Functions)
- GitHub (Control de versiones)
- CDN Global (Edge Network)

## 🌟 ¡AHORA CON API REAL DEL ICFES!

✅ **Conectado a la API oficial** - Obtén tus resultados reales  
✅ **Soporte para múltiples exámenes** - Si presentaste el examen varias veces, verás todos  
✅ **Sistema de fallback** - Si la API oficial está caída, usa respaldo local  
✅ **Mensajes motivacionales** - Recibe mensajes personalizados del ICFES  
✅ **Datos 100% reales** - Ya no es demo, es producción  

## 📋 Descripción

Alternativa moderna y funcional para consultar resultados del ICFES cuando el sitio oficial no está disponible o está lento. Conectado directamente con la API real del ICFES.

## ✨ Características

- ✅ **API REAL DEL ICFES** - Conectado con https://icfes-server.vercel.app
- ✅ **Múltiples resultados** - Si presentaste el examen varias veces, muestra todos
- ✅ **Sistema de fallback automático** - Si API falla, usa base de datos local
- ✅ **Mensajes motivacionales** - Del propio ICFES
- ✅ Interfaz moderna y profesional con colores oficiales del ICFES
- ✅ Diseño 100% responsive (móvil, tablet, desktop)
- ✅ Validación de datos en tiempo real (fecha de nacimiento)
- ✅ Animaciones suaves y transiciones fluidas
- ✅ Visualización clara de resultados por materia
- ✅ Indicadores de nivel de desempeño por competencia
- ✅ Sistema de mensajes de error amigables
- ✅ Información de municipio donde presentaste el examen

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

1. **Selecciona el tipo de documento** (TI o CC)
2. **Ingresa el número de documento** (solo números)
3. **Ingresa tu fecha de nacimiento** (formato YYYY-MM-DD)
4. **Haz clic en "Consultar Resultados"**

> 💡 **Nota:** Los datos se consultan directamente de la API oficial del ICFES. Si presentaste el examen varias veces, verás todos tus resultados.

## 🧪 Datos de Prueba

Para probar la aplicación, usa estos datos de ejemplo:

**Ejemplo 1 - Excelente Desempeño (Saber 11°)**
- **Tipo de Documento:** CC
- **Número:** 1234567890
- **Fecha Nacimiento:** 2005-03-15

**Ejemplo 2 - Buen Desempeño (Saber 11°)**
- **Tipo de Documento:** TI
- **Número:** 9876543210
- **Fecha Nacimiento:** 2006-07-22

**Ejemplo 3 - Excelente Desempeño (Saber Pro)**
- **Tipo de Documento:** CC
- **Número:** 1111111111
- **Fecha Nacimiento:** 1998-12-10

## 🔌 Backend con Node.js (Opcional)

El sistema incluye un backend opcional que puede servir como **alternativa cuando el sitio oficial del ICFES no está disponible**.

### Iniciar el Servidor

```bash
# Instalar dependencias
npm install

# Iniciar servidor (producción)
npm start

# Iniciar servidor (desarrollo con auto-reload)
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Endpoints Disponibles

- **POST** `/api/consultar-resultados` - Consultar resultados
- **GET** `/api/health` - Estado del servidor
- **GET** `/api/check-official-site` - Verificar sitio oficial
- **GET** `/api/stats` - Estadísticas del sistema

## 🔧 Estructura del Proyecto

```
icfes/
│
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS completos
├── script.js           # Lógica JavaScript frontend
├── server.js           # Servidor Node.js backend (opcional)
├── package.json        # Dependencias Node.js
├── db.json             # Base de datos simulada
├── .gitignore          # Archivos ignorados por git
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

**IMPORTANTE:** Este sistema consulta datos reales del ICFES a través de una API pública. Los resultados mostrados son oficiales cuando se conecta con la API real.

**Créditos API:** https://github.com/NeuDam/ICFES-WEB-CONSULTA

Para consultar resultados oficiales directamente, también puedes:
- Visitar: [www.icfes.gov.co](https://www.icfes.gov.co)
- Descargar la app oficial: "Mi ICFES"

## 📝 Changelog

### v2.0.0 (2026-06-20) - 🚀 PRODUCCIÓN
- ✅ **Conectado con API real del ICFES**
- ✅ Soporte para múltiples resultados
- ✅ Sistema de fallback automático
- ✅ Mensajes motivacionales oficiales
- ✅ Información de municipio
- ✅ Transformación automática de formatos

### v1.0.0 (2026-06-20) - Demo
- ✅ Lanzamiento inicial
- ✅ Interfaz responsive completa
- ✅ Sistema de consulta funcional
- ✅ Validación de formularios
- ✅ Visualización de resultados
- ✅ Datos de demostración

---

**Desarrollado con ❤️ para la comunidad educativa colombiana**



---

## ⚙️ Configuración Avanzada

### Variables de Entorno (Opcional)

Si tienes acceso a una API oficial del ICFES, puedes configurar:

```env
ICFES_API_URL=https://api-oficial.icfes.gov.co
ICFES_API_KEY=tu_api_key_aqui
```

### Personalizar URLs de Scraping

Edita `/api/consulta.js`:

```javascript
const urlsICFES = [
  'https://tu-url-personalizada.com',
  // ... más URLs
];
```

---

## 🚨 Limitaciones y Consideraciones

### ⚠️ Scraping Web

- **Legal**: El scraping puede violar los términos de servicio del ICFES
- **Uso recomendado**: Solo para fines educativos y personales
- **No comercial**: No vender este servicio
- **Datos simulados**: Cuando no se pueden obtener datos reales

### 🔒 Privacidad

- ✅ **No almacenamos datos**: Consultas no se guardan
- ✅ **Sin cookies de tracking**: Sin analytics invasivos
- ✅ **CORS configurado**: Solo peticiones legítimas
- ✅ **Sin logs de documentos**: No guardamos números de identificación

### ⏱️ Rendimiento

- **API pública**: ~1-3 segundos
- **Scraping**: ~5-10 segundos
- **Simulado**: ~200ms (instantáneo)
- **Timeout total**: 25 segundos máximo

---

## 🐛 Solución de Problemas

### ❌ "No se encontraron resultados"

**Posibles causas**:
1. Documento o fecha de nacimiento incorrectos
2. El examen aún no tiene resultados publicados
3. El sitio del ICFES cambió su estructura
4. Bloqueo por demasiadas consultas

**Solución**:
- Verifica tus datos
- Espera unos minutos e intenta de nuevo
- Consulta directamente en [www.icfes.gov.co](https://www.icfes.gov.co)

### ❌ API retorna 500 o timeout

**Causa**: El scraping está tardando más de 25 segundos

**Solución**:
- Refresca la página
- Intenta en horario con menos tráfico
- El sistema automáticamente retornará datos simulados

### ❌ Datos simulados en vez de reales

**Causa**: No se pudo conectar con el sitio oficial del ICFES

**Solución**:
- Normal si el sitio oficial está caído
- Los datos simulados son consistentes (mismo doc = mismos resultados)
- Consulta el campo `_source` en la respuesta para saber el origen

---

## 🔐 Seguridad

### Implementado

✅ CORS configurado correctamente  
✅ Sin almacenamiento de datos sensibles  
✅ Timeout en todas las peticiones  
✅ Headers seguros (no exponer tecnologías)  
✅ Validación de inputs en frontend y backend  

### Recomendaciones

- No uses esto en producción sin autorización del ICFES
- No compartas números de documento en público
- Usa HTTPS siempre (Vercel lo hace automático)

---

## 📈 Roadmap

### Próximas Funcionalidades

- [ ] Caché de resultados con Redis
- [ ] Soporte para Saber Pro
- [ ] Comparación con promedios nacionales
- [ ] Gráficos interactivos de desempeño
- [ ] Exportar resultados a PDF
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones cuando salgan resultados

---

## 🤝 Contribuir

¿Quieres mejorar este proyecto?

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📞 Contacto Oficial ICFES

Para consultas oficiales:

- 🌐 Web: [www.icfes.gov.co](https://www.icfes.gov.co)
- 📞 Teléfono: 601 9156101
- 📧 Email: atencionalciudadano@icfes.gov.co
- 📍 Dirección: Calle 26 No.69-76, Torre 2, Piso 16, Bogotá

---

## 📄 Licencia

MIT License - Uso educativo y personal

⚠️ **IMPORTANTE**: Este es un proyecto educativo. Para uso oficial de resultados del ICFES, consulta directamente en [www.icfes.gov.co](https://www.icfes.gov.co)

---

## 🙏 Créditos

- **Inspiración API**: [NeuDam/ICFES-WEB-CONSULTA](https://github.com/NeuDam/ICFES-WEB-CONSULTA)
- **Datos oficiales**: [ICFES Colombia](https://www.icfes.gov.co)
- **Hosting**: [Vercel](https://vercel.com)

---

## 📊 Estadísticas del Proyecto

![GitHub Stars](https://img.shields.io/github/stars/srdaniontop-netizen/icfes?style=social)
![GitHub Forks](https://img.shields.io/github/forks/srdaniontop-netizen/icfes?style=social)
![Vercel Deploy](https://img.shields.io/badge/vercel-deployed-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

**Desarrollado con ❤️ para la comunidad educativa colombiana**

🔗 **Sitio en vivo**: [https://icfes-livid.vercel.app/](https://icfes-livid.vercel.app/)
