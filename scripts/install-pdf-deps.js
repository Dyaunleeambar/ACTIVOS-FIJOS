const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Dependencias necesarias para la conversión a PDF
const pdfDependencies = [
    'markdown-pdf',
    'puppeteer',
    'marked',
    'highlight.js',
    'cheerio',
    'fs-extra'
];

// Función para instalar dependencias
async function installPdfDependencies() {
    try {
        console.log('📦 Instalando dependencias para conversión a PDF...\n');
        
        // Verificar si package.json existe
        if (!fs.existsSync('package.json')) {
            console.error('❌ Error: No se encontró package.json en el directorio actual');
            process.exit(1);
        }
        
        // Instalar cada dependencia
        for (const dep of pdfDependencies) {
            console.log(`📥 Instalando ${dep}...`);
            try {
                execSync(`npm install ${dep}`, { stdio: 'inherit' });
                console.log(`✅ ${dep} instalado correctamente`);
            } catch (error) {
                console.error(`❌ Error al instalar ${dep}:`, error.message);
            }
        }
        
        console.log('\n🎉 ¡Instalación de dependencias completada!');
        console.log('\n📋 Dependencias instaladas:');
        pdfDependencies.forEach(dep => console.log(`   - ${dep}`));
        
        console.log('\n🚀 Ahora puedes usar los siguientes comandos:');
        console.log('   npm run convert-docs     # Convertir todos los documentos');
        console.log('   npm run convert-single   # Convertir un documento específico');
        console.log('   node scripts/convert-docs.js');
        console.log('   node scripts/convert-single.js <archivo.md>');
        
    } catch (error) {
        console.error('💥 Error durante la instalación:', error);
        process.exit(1);
    }
}

// Función para verificar dependencias instaladas
async function checkDependencies() {
    try {
        console.log('🔍 Verificando dependencias instaladas...\n');
        
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const installedDeps = Object.keys(packageJson.dependencies || {});
        const installedDevDeps = Object.keys(packageJson.devDependencies || {});
        const allInstalled = [...installedDeps, ...installedDevDeps];
        
        let missingDeps = [];
        
        for (const dep of pdfDependencies) {
            if (!allInstalled.includes(dep)) {
                missingDeps.push(dep);
            }
        }
        
        if (missingDeps.length === 0) {
            console.log('✅ Todas las dependencias están instaladas');
            return true;
        } else {
            console.log('❌ Faltan las siguientes dependencias:');
            missingDeps.forEach(dep => console.log(`   - ${dep}`));
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al verificar dependencias:', error);
        return false;
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--check') || args.includes('-c')) {
        const allInstalled = await checkDependencies();
        if (!allInstalled) {
            console.log('\n💡 Ejecuta este script sin argumentos para instalar las dependencias faltantes');
        }
        return;
    }
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
📦 Instalador de Dependencias para Conversión a PDF

Uso: node scripts/install-pdf-deps.js [opciones]

Opciones:
  --check, -c    Verificar dependencias instaladas
  --help, -h     Mostrar esta ayuda

Ejemplos:
  node scripts/install-pdf-deps.js
  node scripts/install-pdf-deps.js --check
        `);
        return;
    }
    
    // Verificar si ya están instaladas
    const allInstalled = await checkDependencies();
    if (allInstalled) {
        console.log('✅ Todas las dependencias ya están instaladas');
        return;
    }
    
    // Instalar dependencias
    await installPdfDependencies();
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = {
    installPdfDependencies,
    checkDependencies
}; 
