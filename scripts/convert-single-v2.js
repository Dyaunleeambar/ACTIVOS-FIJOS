const fs = require('fs-extra');
const path = require('path');
const { convertToPdf } = require('./convert-docs-v2');

// Configuración
const config = {
    inputDir: './docs',
    outputDir: './pdf-docs'
};

// Función para mostrar ayuda
function showHelp() {
    console.log(`
📄 Convertidor de Markdown a PDF - Archivo Individual (v2)

Uso: node scripts/convert-single-v2.js <archivo.md> [opciones]

Argumentos:
  archivo.md    Nombre del archivo Markdown a convertir (debe estar en ./docs/)

Opciones:
  -h, --help    Mostrar esta ayuda
  -o, --output  Nombre del archivo PDF de salida (opcional)

Ejemplos:
  node scripts/convert-single-v2.js README.md
  node scripts/convert-single-v2.js docs/01-analisis-requerimientos.md
  node scripts/convert-single-v2.js 01-analisis-requerimientos.md -o analisis.pdf

Archivos disponibles en ./docs/:
`);
    
    // Listar archivos disponibles
    try {
        const files = fs.readdirSync(config.inputDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        markdownFiles.forEach((file, index) => {
            console.log(`  ${index + 1}. ${file}`);
        });
    } catch (error) {
        console.log('  No se pudo leer el directorio ./docs/');
    }
}

// Función principal
async function convertSingleFile() {
    const args = process.argv.slice(2);
    
    // Verificar argumentos
    if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
        showHelp();
        return;
    }
    
    const inputFile = args[0];
    let outputFile = null;
    
    // Procesar opciones
    for (let i = 1; i < args.length; i++) {
        if (args[i] === '-o' || args[i] === '--output') {
            if (i + 1 < args.length) {
                outputFile = args[i + 1];
                i++; // Saltar el siguiente argumento
            } else {
                console.error('❌ Error: Se requiere un nombre de archivo después de -o/--output');
                process.exit(1);
            }
        }
    }
    
    // Verificar que el archivo existe
    const inputPath = path.join(config.inputDir, inputFile);
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Error: El archivo '${inputFile}' no existe en ./docs/`);
        console.log('\nArchivos disponibles:');
        try {
            const files = fs.readdirSync(config.inputDir);
            const markdownFiles = files.filter(file => file.endsWith('.md'));
            markdownFiles.forEach(file => console.log(`  - ${file}`));
        } catch (error) {
            console.log('  No se pudo leer el directorio ./docs/');
        }
        process.exit(1);
    }
    
    // Generar nombre de archivo de salida si no se especificó
    if (!outputFile) {
        outputFile = inputFile.replace('.md', '.pdf');
    }
    
    // Asegurar que el directorio de salida existe
    try {
        await fs.ensureDir(config.outputDir);
    } catch (error) {
        console.error('❌ Error al crear directorio de salida:', error);
        process.exit(1);
    }
    
    try {
        console.log(`🚀 Convirtiendo: ${inputFile} → ${outputFile}`);
        console.log(`📁 Ruta de entrada: ${path.resolve(inputPath)}`);
        console.log(`📁 Ruta de salida: ${path.resolve(path.join(config.outputDir, outputFile))}`);
        console.log('');
        
        await convertToPdf(inputFile, outputFile);
        
        console.log('\n✅ ¡Conversión completada exitosamente!');
        console.log(`📄 Archivo PDF generado: ${path.resolve(path.join(config.outputDir, outputFile))}`);
        
    } catch (error) {
        console.error('💥 Error durante la conversión:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    convertSingleFile();
}

module.exports = {
    convertSingleFile
}; 
