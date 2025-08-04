// Script de prueba para verificar la navegación
console.log('🧪 Iniciando prueba de navegación...');

// Función para probar la navegación
function testNavigation() {
    console.log('🔍 Verificando elementos de navegación...');
    
    // Verificar que los links de navegación existan
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('📋 Links de navegación encontrados:', navLinks.length);
    
    navLinks.forEach((link, index) => {
        const page = link.getAttribute('data-page');
        const text = link.textContent.trim();
        console.log(`📋 Link ${index + 1}: ${text} (${page})`);
    });
    
    // Verificar que las páginas existan
    const pages = document.querySelectorAll('.page-content');
    console.log('📋 Páginas encontradas:', pages.length);
    
    pages.forEach((page, index) => {
        const isActive = page.classList.contains('active');
        const display = window.getComputedStyle(page).display;
        const visibility = window.getComputedStyle(page).visibility;
        console.log(`📋 Página ${index + 1}: ${page.id} (active: ${isActive}, display: ${display}, visibility: ${visibility})`);
    });
    
    // Verificar la página activa actual
    const activePage = document.querySelector('.page-content.active');
    if (activePage) {
        console.log('✅ Página activa actual:', activePage.id);
    } else {
        console.warn('⚠️ No hay página activa');
    }
    
    console.log('🎯 Prueba de navegación completada');
}

// Función para simular navegación
function simulateNavigation(pageName) {
    console.log(`🎭 Simulando navegación a: ${pageName}`);
    
    // Simular clic en el link de navegación
    const navLink = document.querySelector(`[data-page="${pageName}"]`);
    if (navLink) {
        console.log('✅ Link encontrado, simulando clic...');
        navLink.click();
        
        // Verificar el resultado después de un delay
        setTimeout(() => {
            const targetPage = document.getElementById(pageName + '-page');
            if (targetPage && targetPage.classList.contains('active')) {
                console.log('✅ Navegación exitosa a:', pageName);
            } else {
                console.error('❌ Navegación fallida a:', pageName);
            }
        }, 200);
    } else {
        console.error('❌ Link no encontrado para:', pageName);
    }
}

// Función para forzar navegación
function forceNavigation(pageName) {
    console.log(`🔧 Forzando navegación a: ${pageName}`);
    
    if (window.UI && window.UI.showPage) {
        window.UI.showPage(pageName);
        
        // Verificar el resultado
        setTimeout(() => {
            const targetPage = document.getElementById(pageName + '-page');
            if (targetPage && targetPage.classList.contains('active')) {
                console.log('✅ Navegación forzada exitosa a:', pageName);
            } else {
                console.error('❌ Navegación forzada fallida a:', pageName);
            }
        }, 100);
    } else {
        console.error('❌ UI.showPage no está disponible');
    }
}

// Función para verificar estado de navegación
function checkNavigationState() {
    console.log('🔍 Verificando estado de navegación...');
    
    // Verificar página activa
    const activePage = document.querySelector('.page-content.active');
    if (activePage) {
        console.log('✅ Página activa:', activePage.id);
        
        // Verificar estilos computados
        const computedStyle = window.getComputedStyle(activePage);
        console.log('📊 Display:', computedStyle.display);
        console.log('📊 Opacidad:', computedStyle.opacity);
        console.log('📊 Visibilidad:', computedStyle.visibility);
    } else {
        console.warn('⚠️ No hay página activa');
    }
    
    // Verificar link activo
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        console.log('✅ Link activo:', activeLink.textContent.trim());
    } else {
        console.warn('⚠️ No hay link activo');
    }
    
    // Verificar título de página
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        console.log('✅ Título de página:', pageTitle.textContent);
    } else {
        console.warn('⚠️ No se encontró título de página');
    }
}

// Función para probar navegación sin clics adicionales
function testNavigationWithoutExtraClicks() {
    console.log('🧪 Probando navegación sin clics adicionales...');
    
    const pages = ['dashboard', 'equipment', 'assignments', 'reports', 'security', 'disposal'];
    
    pages.forEach((pageName, index) => {
        setTimeout(() => {
            console.log(`🎯 Probando navegación a: ${pageName}`);
            
            // Simular clic en el link
            const navLink = document.querySelector(`[data-page="${pageName}"]`);
            if (navLink) {
                navLink.click();
                
                // Verificar después de un delay
                setTimeout(() => {
                    const targetPage = document.getElementById(pageName + '-page');
                    const isActive = targetPage && targetPage.classList.contains('active');
                    const display = targetPage ? window.getComputedStyle(targetPage).display : 'none';
                    
                    if (isActive && display === 'block') {
                        console.log(`✅ ${pageName}: Navegación exitosa sin clics adicionales`);
                    } else {
                        console.error(`❌ ${pageName}: Navegación fallida - requiere clic adicional`);
                    }
                }, 300);
            }
        }, index * 500);
    });
}

// Ejecutar prueba cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testNavigation);
} else {
    testNavigation();
}

// Exportar funciones para uso manual
window.testNavigation = testNavigation;
window.simulateNavigation = simulateNavigation;
window.forceNavigation = forceNavigation;
window.checkNavigationState = checkNavigationState;
window.testNavigationWithoutExtraClicks = testNavigationWithoutExtraClicks; 
