// Script de prueba para verificar el modal de importación
console.log('🧪 Iniciando prueba del modal de importación...');

// Función para probar el modal
function testImportModal() {
    console.log('🔍 Verificando elementos del modal...');
    
    const modal = document.getElementById('import-modal');
    if (!modal) {
        console.error('❌ Modal no encontrado');
        return;
    }
    
    console.log('✅ Modal encontrado');
    console.log('📋 Estilos del modal:', modal.style.cssText);
    
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        console.log('✅ Contenido del modal encontrado');
        console.log('📋 Estilos del contenido:', modalContent.style.cssText);
    }
    
    const modalHeader = modal.querySelector('.modal-header');
    if (modalHeader) {
        console.log('✅ Header del modal encontrado');
        console.log('📋 Estilos del header:', modalHeader.style.cssText);
    }
    
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        console.log('✅ Botón de cerrar encontrado');
        console.log('📋 Estilos del botón:', closeBtn.style.cssText);
    }
    
    // Verificar que el modal tenga los estilos correctos
    const expectedStyles = [
        'position: fixed',
        'background-color: rgba(0, 0, 0, 0.5)',
        'z-index: 9999999',
        'backdrop-filter: blur(2px)'
    ];
    
    const modalStyles = modal.style.cssText;
    let allStylesPresent = true;
    
    expectedStyles.forEach(style => {
        if (!modalStyles.includes(style)) {
            console.warn(`⚠️ Estilo faltante: ${style}`);
            allStylesPresent = false;
        }
    });
    
    if (allStylesPresent) {
        console.log('✅ Todos los estilos del modal están presentes');
    } else {
        console.error('❌ Faltan algunos estilos del modal');
    }
    
    console.log('🎯 Prueba completada');
}

// Ejecutar prueba cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testImportModal);
} else {
    testImportModal();
}

// Exportar función para uso manual
window.testImportModal = testImportModal; 