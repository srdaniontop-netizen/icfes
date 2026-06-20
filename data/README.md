# 📊 Base de Datos Histórica de Resultados ICFES

Esta carpeta contiene la base de datos JSON con **resultados reales** del ICFES Saber 11.

## 📁 Archivo Principal

- **`resultados-historicos.json`** - Base de datos con todos los resultados

## 🔢 Estructura de Datos

```json
{
  "metadata": {
    "version": "1.0.0",
    "lastUpdate": "2026-06-20",
    "totalRecords": 50,
    "source": "Resultados históricos ICFES Saber 11"
  },
  "resultados": [
    {
      "documento": "1234567890",
      "tipoDocumento": "TI",
      "fechaNacimiento": "15/03/2005",
      "estudiante": "NOMBRE COMPLETO",
      "examenes": [
        {
          "ACREGISTRO": "AC20241234567",
          "puntaje": 387,
          "ciudad": "BOGOTÁ D.C.",
          "fechaResultados": "2024-11-15",
          "periodo": "2024-2",
          "mensajeMotivacional": "¡Excelentes resultados!",
          "puntajeMaterias": [...]
        }
      ]
    }
  ]
}
```

## ➕ Agregar Nuevos Resultados

### Método 1: Panel de Administración (Recomendado)

1. Visita: `https://tu-sitio.vercel.app/admin.html`
2. Ingresa la API Key: `icfes-admin-2026`
3. Pega el JSON del resultado
4. Click en "Agregar"

### Método 2: API Directa

```bash
curl -X POST https://tu-sitio.vercel.app/api/agregar-resultado \
  -H "Content-Type: application/json" \
  -H "X-API-Key: icfes-admin-2026" \
  -d '{
    "documento": "1234567890",
    "tipoDocumento": "TI",
    "fechaNacimiento": "15/03/2005",
    "estudiante": "JUAN PÉREZ GARCÍA",
    "examenes": [...]
  }'
```

### Método 3: Script de Migración

Para importar resultados desde la API pública:

```bash
# Editar lista de documentos en scripts/migrar-resultados.js
node scripts/migrar-resultados.js
```

## 🔒 Seguridad

- **API Key requerida**: Solo usuarios autorizados pueden agregar resultados
- **Validación automática**: Se verifican campos requeridos
- **Sin duplicados**: Documentos existentes se actualizan en vez de duplicarse
- **Backup recomendado**: Hacer copias periódicas de `resultados-historicos.json`

## 📈 Estadísticas

- **Total de registros**: Variable (se actualiza en metadata)
- **Última actualización**: Ver campo `metadata.lastUpdate`
- **Promedio de exámenes por estudiante**: ~1-2

## 🔍 Búsqueda

La búsqueda en la base de datos es:

- **Por documento**: Comparación flexible (ignora puntos y guiones)
- **Por tipo**: TI (Tarjeta de Identidad) o CC (Cédula)
- **Por fecha**: Opcional (permite pequeñas variaciones)

## 🎯 Casos de Uso

1. **Estudiantes con múltiples exámenes**: Si presentaron el ICFES varias veces
2. **Datos históricos**: Resultados de años anteriores (2020-2024)
3. **Validación cruzada**: Comparar con otras fuentes
4. **Análisis estadístico**: Tendencias de puntajes por ciudad/año

## ⚠️ Privacidad

- **Datos anonimizados**: Nombres pueden ser modificados
- **Sin datos sensibles**: No se almacenan direcciones, teléfonos, etc.
- **Uso educativo**: Solo para fines de demostración y consulta personal

## 🔄 Actualización Automática

El sistema puede actualizarse automáticamente cuando:

1. Un usuario consulta su documento real
2. Se obtienen datos del sitio oficial del ICFES
3. Se ejecuta el script de migración

## 📊 Formato de Respuesta

Cuando se consulta un resultado desde la BD histórica:

```json
{
  "status": true,
  "estudiante": "NOMBRE COMPLETO",
  "examenes": [...],
  "_source": "base_datos_historica",
  "_note": "Resultados reales del ICFES obtenidos de nuestra base de datos histórica",
  "_timestamp": "2026-06-20T05:30:00.000Z"
}
```

El campo `"_source": "base_datos_historica"` indica que los datos provienen de esta base de datos.

## 🛠️ Mantenimiento

### Backup Manual

```bash
# Crear copia de seguridad
cp data/resultados-historicos.json data/backup-$(date +%Y%m%d).json
```

### Validar JSON

```bash
# Verificar que el JSON sea válido
cat data/resultados-historicos.json | python -m json.tool > /dev/null && echo "✅ JSON válido"
```

### Contar Registros

```bash
# Ver cantidad de registros
cat data/resultados-historicos.json | grep -o '"documento"' | wc -l
```

## 📞 Contacto

Para agregar resultados masivos o reportar problemas con la base de datos, contacta al administrador del sistema.

---

**Última actualización**: 2026-06-20
