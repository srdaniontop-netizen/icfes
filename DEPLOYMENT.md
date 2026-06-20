# 🚀 Guía de Despliegue en Vercel

## 📋 Prerequisitos

1. Cuenta en Vercel (gratis): https://vercel.com
2. Repositorio en GitHub (ya lo tienes)

## 🔧 Pasos para Desplegar

### Método 1: Vercel Dashboard (Recomendado)

1. **Ve a Vercel** → https://vercel.com/new

2. **Importa tu repositorio**
   - Click en "Import Project"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio: `srdaniontop-netizen/icfes`

3. **Configura el proyecto**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (dejar vacío)
   Output Directory: (dejar vacío)
   Install Command: npm install
   ```

4. **Variables de entorno** (opcional)
   ```
   NODE_ENV=production
   ```

5. **Click en "Deploy"** 🚀

6. **Espera 1-2 minutos**

7. **¡Listo!** Tu sitio estará en:
   ```
   https://icfes-[tu-proyecto].vercel.app
   ```

### Método 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Ir a tu proyecto
cd icfes

# Login en Vercel
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

## 🎯 Funcionalidades Implementadas

### Backend Serverless (`/api/consulta.js`)

✅ **3 Estrategias de Scraping:**
1. Consulta directa a endpoints oficiales del ICFES
2. Scraping con Cheerio del HTML del sitio web
3. Fallback a base de datos local

✅ **Características:**
- CORS configurado
- Timeout de 10 segundos
- User-Agent realista
- Múltiples URLs de respaldo
- Parseo inteligente de HTML
- Manejo de tokens CSRF

### Frontend Mejorado

✅ **Sistema de Consulta Inteligente:**
- Intenta múltiples APIs automáticamente
- Muestra mensajes claros de progreso en consola
- Fallback a datos locales si todo falla
- Compatible con GitHub Pages y Vercel

## 🔍 URLs que Intenta

El sistema intenta en orden:

1. `/api/consulta` (Vercel Serverless - TU BACKEND)
2. `https://icfes-server.vercel.app/consulta` (API pública si vuelve)
3. `https://www.icfes.gov.co/servicios/resultados-en-linea` (Scraping)
4. `https://resultados.icfes.gov.co/consulta` (Scraping)
5. `https://www2.icfes.gov.co/resultados-saber-11` (Scraping)
6. Base de datos local (fallback)

## 📊 Cómo Funciona

```
Usuario → Frontend JavaScript → /api/consulta (Vercel)
                                      ↓
                           Intenta consultar ICFES
                                      ↓
                              ┌────────┴────────┐
                              ↓                  ↓
                         Éxito ✅           Falla ❌
                              ↓                  ↓
                      Retorna datos      Intenta scraping
                                              ↓
                                        ┌─────┴─────┐
                                        ↓            ↓
                                   Éxito ✅      Falla ❌
                                        ↓            ↓
                                 Retorna datos  404 Error
                                                     ↓
                                            Frontend usa DB local
```

## 🐛 Debugging

### Ver logs en Vercel:

1. Ve a tu proyecto en Vercel
2. Click en "Functions"
3. Click en `/api/consulta`
4. Ver "Logs" en tiempo real

### Probar localmente:

```bash
# Instalar dependencias
npm install

# Iniciar servidor local
npm run dev

# Probar endpoint
curl -X POST http://localhost:3000/api/consulta \
  -H "Content-Type: application/json" \
  -d '{"document":"1234567890","young":true,"born":"15/03/2005"}'
```

## ⚙️ Configuración Avanzada

### Si necesitas Puppeteer (navegador real):

1. En Vercel Dashboard → Settings → Functions
2. Agregar variable de entorno:
   ```
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

3. Cambiar endpoint en `script.js`:
   ```javascript
   '/api/scraper-puppeteer'  // En vez de '/api/consulta'
   ```

**Nota:** Puppeteer en Vercel puede ser lento (función puede tardar 10+ segundos)

## 🔒 Seguridad

✅ **Implementado:**
- CORS configurado
- Sin almacenamiento de datos personales
- Timeout en peticiones
- Rate limiting por función (Vercel lo hace automático)

⚠️ **Consideraciones:**
- El scraping puede violar términos de servicio del ICFES
- Úsalo solo para fines educativos/personales
- No lo vendas como servicio comercial

## 📝 Próximos Pasos Opcionales

1. **Dominio personalizado**
   - En Vercel → Settings → Domains
   - Agregar: `resultados-icfes.com` (ejemplo)

2. **Analytics**
   - Vercel Analytics (gratis)
   - Google Analytics

3. **Caché**
   - Implementar Redis para cachear resultados
   - Reducir carga al sitio del ICFES

4. **Rate Limiting**
   - Limitar consultas por IP
   - Evitar abuso

## 🆘 Solución de Problemas

### Error: "Function invocation timeout"
- La función tardó más de 10 segundos
- Solución: Aumentar timeout en `vercel.json`:
  ```json
  {
    "functions": {
      "api/consulta.js": {
        "maxDuration": 30
      }
    }
  }
  ```

### Error: "Module not found"
- Falta instalar dependencias
- Solución: Asegúrate que `package.json` esté correcto

### No retorna datos
- Revisa logs en Vercel Dashboard
- El sitio del ICFES puede haber cambiado su estructura
- Actualiza selectores CSS en `api/consulta.js`

## 📞 Soporte

Si algo no funciona:
1. Revisa logs en Vercel
2. Abre la consola del navegador (F12)
3. Busca mensajes de error
4. Ajusta el código según sea necesario

---

**¡Listo para desplegar!** 🚀

Tu sitio funcionará con datos reales del ICFES (si están disponibles) o con datos de demostración como fallback.
