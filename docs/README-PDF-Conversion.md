# Sistema de Conversión de Documentos a PDF

Este sistema permite convertir automáticamente todos los documentos Markdown del proyecto a formato PDF con un diseño profesional y consistente.

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
# Instalar todas las dependencias necesarias
node scripts/install-pdf-deps.js

# O verificar si ya están instaladas
node scripts/install-pdf-deps.js --check
```

### 2. Verificar Estructura

Asegúrate de que existan los siguientes directorios y archivos:

```
proyecto/
├── docs/                    # Documentos Markdown
├── templates/               # Templates para PDF
│   ├── pdf-styles.css      # Estilos CSS
│   └── runnings.js         # Configuración de headers/footers
├── scripts/                 # Scripts de conversión
│   ├── convert-docs.js     # Conversión masiva
│   ├── convert-single.js   # Conversión individual
│   └── install-pdf-deps.js # Instalador de dependencias
└── pdf-docs/               # Archivos PDF generados (se crea automáticamente)
```

## 📋 Uso

### Conversión Masiva

Convertir todos los documentos Markdown a PDF:

```bash
# Usando npm script
npm run convert-docs

# O directamente
node scripts/convert-docs.js
```

### Conversión Individual

Convertir un documento específico:

```bash
# Convertir un archivo específico
node scripts/convert-single.js 01-analisis-requerimientos.md

# Especificar nombre de salida
node scripts/convert-single.js 01-analisis-requerimientos.md -o analisis.pdf

# Ver ayuda
node scripts/convert-single.js --help
```

### Verificar Archivos Disponibles

```bash
# Listar archivos Markdown disponibles
node scripts/convert-single.js --help
```

## 📁 Archivos Generados

Los archivos PDF se generan en el directorio `pdf-docs/` con la siguiente estructura:

```
pdf-docs/
├── 00-recomendaciones-opinion.pdf
├── 01-analisis-requerimientos.pdf
├── 02-plan-proyecto.pdf
├── 03-cronograma-desarrollo.pdf
├── 04-arquitectura-sistema.pdf
├── 05-especificaciones-tecnicas.pdf
└── 06-modelo-datos.pdf
```

## 🎨 Características del PDF

### Diseño Profesional
- **Fuente**: Inter (Google Fonts)
- **Colores**: Paleta profesional azul/gris
- **Layout**: Centrado, máximo 800px de ancho
- **Espaciado**: Generoso para mejor legibilidad

### Elementos Incluidos
- **Header**: Título del documento con subtítulos del proyecto
- **Footer**: Información de página y proyecto
- **Estilos**: Código resaltado, tablas formateadas, citas
- **Saltos de página**: Automáticos para títulos y elementos importantes

### Características Técnicas
- **Formato**: A4, orientación vertical
- **Márgenes**: 1cm en todos los lados
- **Codificación**: UTF-8
- **Idioma**: Español

## 🔧 Configuración

### Personalizar Estilos

Edita `templates/pdf-styles.css` para modificar:

- Colores y fuentes
- Espaciado y márgenes
- Estilos de tablas y código
- Headers y footers

### Personalizar Headers/Footers

Edita `templates/runnings.js` para modificar:

- Información de página
- Logo o texto del proyecto
- Formato de fecha

### Opciones de Conversión

En `scripts/convert-docs.js` puedes modificar:

- Formato de papel (A4, Letter, etc.)
- Orientación (portrait, landscape)
- Márgenes
- Timeouts de renderizado

## 📊 Comandos Disponibles

```bash
# Scripts npm
npm run convert-docs      # Convertir todos los documentos
npm run convert-single    # Convertir documento individual
npm run build-docs        # Alias para convert-docs

# Scripts directos
node scripts/convert-docs.js
node scripts/convert-single.js <archivo.md>
node scripts/install-pdf-deps.js

# Verificar dependencias
node scripts/install-pdf-deps.js --check
```

## 🛠️ Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
node scripts/install-pdf-deps.js
```

### Error: "Puppeteer timeout"
- Aumentar `loadTimeout` en las opciones
- Verificar conexión a internet (para fuentes Google)

### Error: "Font not found"
- Las fuentes se descargan automáticamente
- Verificar conexión a internet
- Usar fuentes del sistema como fallback

### PDF muy grande
- Reducir márgenes en las opciones
- Optimizar imágenes en Markdown
- Usar orientación landscape si es necesario

## 📈 Rendimiento

### Optimizaciones Incluidas
- **Streaming**: Procesamiento por streams para archivos grandes
- **Caché**: Puppeteer reutiliza instancias
- **Timeouts**: Configurables para diferentes entornos
- **Memoria**: Limpieza automática de recursos

### Tiempos Estimados
- **Documento pequeño** (< 50KB): ~5-10 segundos
- **Documento mediano** (50-200KB): ~10-20 segundos
- **Documento grande** (> 200KB): ~20-30 segundos

## 🔄 Automatización

### Integración con CI/CD

Agregar a tu pipeline:

```yaml
# GitHub Actions example
- name: Generate PDFs
  run: |
    npm install
    node scripts/install-pdf-deps.js
    npm run convert-docs
```

### Script de Despliegue

```bash
#!/bin/bash
# deploy-docs.sh
echo "Generando documentación PDF..."
npm run convert-docs
echo "Documentación PDF generada en pdf-docs/"
```

## 📝 Notas Técnicas

### Dependencias Principales
- **markdown-pdf**: Conversión principal
- **puppeteer**: Renderizado HTML a PDF
- **marked**: Parsing de Markdown
- **highlight.js**: Resaltado de código
- **cheerio**: Manipulación HTML
- **fs-extra**: Utilidades de archivos

### Compatibilidad
- **Node.js**: 14.x o superior
- **Sistemas**: Windows, macOS, Linux
- **Navegadores**: Chrome/Chromium (requerido por Puppeteer)

### Limitaciones
- Imágenes externas requieren conexión a internet
- Fuentes personalizadas pueden aumentar el tamaño
- Tablas muy anchas pueden causar problemas de layout

---

*Sistema de conversión PDF para el Sistema de Gestión de Medios Informáticos* 
