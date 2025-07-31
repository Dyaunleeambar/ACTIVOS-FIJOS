const fs = require('fs-extra');
const path = require('path');
const markdownPdf = require('markdown-pdf');
const cheerio = require('cheerio');

// Configuración del proyecto
const config = {
    inputDir: './docs',
    outputDir: './pdf-docs',
    templatePath: './templates/pdf-template.html',
    cssPath: './templates/pdf-styles.css'
};

// Función para crear el directorio de salida si no existe
async function ensureOutputDir() {
    try {
        await fs.ensureDir(config.outputDir);
        console.log('✅ Directorio de salida creado/verificado');
    } catch (error) {
        console.error('❌ Error al crear directorio de salida:', error);
        throw error;
    }
}

// Función para obtener todos los archivos Markdown
async function getMarkdownFiles() {
    try {
        const files = await fs.readdir(config.inputDir);
        return files.filter(file => file.endsWith('.md'));
    } catch (error) {
        console.error('❌ Error al leer directorio de entrada:', error);
        throw error;
    }
}

// Función para crear el template HTML personalizado
function createCustomTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        h1 {
            font-size: 2.5em;
            font-weight: 700;
            color: #1a365d;
            margin-bottom: 0.5em;
            border-bottom: 3px solid #3182ce;
            padding-bottom: 0.3em;
        }
        
        h2 {
            font-size: 1.8em;
            font-weight: 600;
            color: #2d3748;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            border-left: 4px solid #3182ce;
            padding-left: 0.5em;
        }
        
        h3 {
            font-size: 1.4em;
            font-weight: 600;
            color: #4a5568;
            margin-top: 1.2em;
            margin-bottom: 0.4em;
        }
        
        h4 {
            font-size: 1.2em;
            font-weight: 500;
            color: #718096;
            margin-top: 1em;
            margin-bottom: 0.3em;
        }
        
        p {
            margin-bottom: 1em;
            text-align: justify;
        }
        
        ul, ol {
            margin: 1em 0;
            padding-left: 2em;
        }
        
        li {
            margin-bottom: 0.5em;
        }
        
        code {
            background-color: #f7fafc;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            color: #e53e3e;
        }
        
        pre {
            background-color: #2d3748;
            color: #e2e8f0;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
            line-height: 1.4;
        }
        
        pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        
        blockquote {
            border-left: 4px solid #3182ce;
            padding-left: 1em;
            margin: 1em 0;
            color: #4a5568;
            font-style: italic;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
            font-size: 0.9em;
        }
        
        th, td {
            border: 1px solid #e2e8f0;
            padding: 0.75em;
            text-align: left;
        }
        
        th {
            background-color: #f7fafc;
            font-weight: 600;
            color: #2d3748;
        }
        
        tr:nth-child(even) {
            background-color: #f7fafc;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2em;
            padding-bottom: 1em;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .header h1 {
            border: none;
            color: #1a365d;
        }
        
        .header .subtitle {
            color: #718096;
            font-size: 1.1em;
            margin-top: 0.5em;
        }
        
        .footer {
            margin-top: 2em;
            padding-top: 1em;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #718096;
            font-size: 0.9em;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            h1, h2, h3, h4 {
                page-break-after: avoid;
            }
            
            pre, blockquote, table {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{title}}</h1>
        <div class="subtitle">Sistema de Gestión de Medios Informáticos</div>
        <div class="subtitle">Empresa de Servicios Electroenergéticos</div>
    </div>
    
    <div class="content">
        {{content}}
    </div>
    
    <div class="footer">
        <p>Documento generado el {{date}} | Sistema de Gestión de Medios Informáticos</p>
    </div>
</body>
</html>`;
}

// Función para procesar el contenido Markdown y agregar metadatos
function processMarkdownContent(content, filename) {
    // Extraer título del primer h1 o usar el nombre del archivo
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Agregar metadatos al inicio del documento
    const metadata = `---
title: "${title}"
date: "${new Date().toLocaleDateString('es-ES')}"
filename: "${filename}"
---

`;
    
    return metadata + content;
}

// Función para convertir un archivo Markdown a PDF
async function convertToPdf(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        const inputPath = path.join(config.inputDir, inputFile);
        const outputPath = path.join(config.outputDir, outputFile);
        
        // Leer el contenido del archivo
        fs.readFile(inputPath, 'utf8', (err, content) => {
            if (err) {
                reject(err);
                return;
            }
            
            // Procesar el contenido
            const processedContent = processMarkdownContent(content, inputFile);
            
            // Configurar las opciones de markdown-pdf
            const options = {
                cssPath: path.join(__dirname, '../templates/pdf-styles.css'),
                remarkable: {
                    html: true,
                    breaks: true,
                    plugins: [],
                    syntax: ['footnote', 'sup', 'sub']
                },
                runningsPath: path.join(__dirname, '../templates/runnings.js'),
                paperFormat: 'A4',
                paperOrientation: 'portrait',
                paperBorder: '1cm',
                renderDelay: 1000,
                loadTimeout: 30000,
                preProcessMd: function() {
                    return processedContent;
                },
                preProcessHtml: function() {
                    return createCustomTemplate();
                }
            };
            
            // Crear stream de entrada y salida
            const inputStream = require('stream').Readable.from([processedContent]);
            const outputStream = fs.createWriteStream(outputPath);
            
            // Convertir a PDF
            inputStream
                .pipe(markdownPdf(options))
                .pipe(outputStream)
                .on('finish', () => {
                    console.log(`✅ Convertido: ${inputFile} → ${outputFile}`);
                    resolve();
                })
                .on('error', (error) => {
                    console.error(`❌ Error al convertir ${inputFile}:`, error);
                    reject(error);
                });
        });
    });
}

// Función principal para convertir todos los documentos
async function convertAllDocuments() {
    try {
        console.log('🚀 Iniciando conversión de documentos Markdown a PDF...\n');
        
        // Crear directorio de salida
        await ensureOutputDir();
        
        // Obtener lista de archivos Markdown
        const markdownFiles = await getMarkdownFiles();
        console.log(`📁 Encontrados ${markdownFiles.length} archivos Markdown para convertir:\n`);
        
        // Mostrar lista de archivos
        markdownFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file}`);
        });
        console.log('');
        
        // Convertir cada archivo
        for (const file of markdownFiles) {
            const outputFile = file.replace('.md', '.pdf');
            await convertToPdf(file, outputFile);
        }
        
        console.log('\n🎉 ¡Conversión completada exitosamente!');
        console.log(`📂 Los archivos PDF se encuentran en: ${path.resolve(config.outputDir)}`);
        
        // Mostrar resumen
        const outputFiles = await fs.readdir(config.outputDir);
        console.log(`\n📊 Resumen:`);
        console.log(`   - Archivos procesados: ${markdownFiles.length}`);
        console.log(`   - Archivos PDF generados: ${outputFiles.length}`);
        
    } catch (error) {
        console.error('💥 Error durante la conversión:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    convertAllDocuments();
}

module.exports = {
    convertAllDocuments,
    convertToPdf,
    processMarkdownContent
}; 