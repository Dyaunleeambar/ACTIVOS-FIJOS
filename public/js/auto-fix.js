/**
 * Script de auto-corrección para problemas de inicialización
 */

console.log('🔧 Script de auto-corrección cargado');

// Función para verificar si Equipment está funcionando correctamente
function checkEquipmentHealth() {
    console.log('🔍 Verificando salud de Equipment...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no está disponible');
        return false;
    }
    
    // Verificar propiedades críticas
    const criticalChecks = [
        { name: 'filters', check: () => window.Equipment.filters && typeof window.Equipment.filters === 'object' },
        { name: 'currentPage', check: () => typeof window.Equipment.currentPage === 'number' },
        { name: 'stateMapping', check: () => window.Equipment.stateMapping && typeof window.Equipment.stateMapping === 'object' },
        { name: 'init', check: () => typeof window.Equipment.init === 'function' },
        { name: 'setupCompactFilters', check: () => typeof window.Equipment.setupCompactFilters === 'function' },
        { name: 'loadEquipmentList', check: () => typeof window.Equipment.loadEquipmentList === 'function' }
    ];
    
    let allHealthy = true;
    
    criticalChecks.forEach(check => {
        if (check.check()) {
            console.log(`✅ ${check.name}: OK`);
        } else {
            console.error(`❌ ${check.name}: Problema detectado`);
            allHealthy = false;
        }
    });
    
    return allHealthy;
}

// Función para verificar si los event listeners están configurados
function checkEventListeners() {
    console.log('🔍 Verificando event listeners...');
    
    const searchInput = document.getElementById('search-equipment');
    const typeStatusFilter = document.getElementById('filter-type-status');
    const stateFilter = document.getElementById('filter-state');
    
    if (!searchInput || !typeStatusFilter || !stateFilter) {
        console.error('❌ Elementos de filtro no encontrados');
        return false;
    }
    
    // Verificar si los elementos tienen valores inconsistentes
    const hasInconsistentValues = (
        (searchInput.value && !window.Equipment.filters.search) ||
        (typeStatusFilter.value && !window.Equipment.filters.type && !window.Equipment.filters.status) ||
        (stateFilter.value && !window.Equipment.filters.state)
    );
    
    if (hasInconsistentValues) {
        console.warn('⚠️ Detectados valores inconsistentes entre DOM y Equipment');
        return false;
    }
    
    console.log('✅ Event listeners verificados');
    return true;
}

// Función para auto-corregir problemas
function autoFix() {
    console.log('🔧 Ejecutando auto-corrección...');
    
    // Verificar salud de Equipment
    const isHealthy = checkEquipmentHealth();
    const listenersOk = checkEventListeners();
    
    if (!isHealthy || !listenersOk) {
        console.log('🔄 Aplicando correcciones...');
        
        // Limpiar estado
        if (window.Equipment && typeof window.Equipment.cleanState === 'function') {
            console.log('🧹 Limpiando estado...');
            window.Equipment.cleanState();
        }
        
        // Reinicializar
        if (window.Equipment && typeof window.Equipment.init === 'function') {
            console.log('🔄 Reinicializando Equipment...');
            try {
                window.Equipment.init();
                console.log('✅ Auto-corrección completada');
            } catch (error) {
                console.error('❌ Error durante auto-corrección:', error);
            }
        }
    } else {
        console.log('✅ Equipment está funcionando correctamente');
    }
}

// Función para monitorear continuamente
function startMonitoring() {
    console.log('👀 Iniciando monitoreo continuo...');
    
    // Verificar cada 5 segundos
    setInterval(() => {
        const isHealthy = checkEquipmentHealth();
        const listenersOk = checkEventListeners();
        
        if (!isHealthy || !listenersOk) {
            console.log('⚠️ Problema detectado, aplicando auto-corrección...');
            autoFix();
        }
    }, 5000);
}

// Función para verificar y corregir al cargar la página
function checkAndFixOnLoad() {
    console.log('🔍 Verificando estado al cargar...');
    
    // Esperar un poco para que Equipment se inicialice
    setTimeout(() => {
        const isHealthy = checkEquipmentHealth();
        const listenersOk = checkEventListeners();
        
        if (!isHealthy || !listenersOk) {
            console.log('⚠️ Problemas detectados al cargar, aplicando correcciones...');
            autoFix();
        } else {
            console.log('✅ Estado inicial correcto');
        }
    }, 2000);
}

// Función para verificar después de navegación
function checkAfterNavigation() {
    console.log('🔍 Verificando después de navegación...');
    
    // Verificar si estamos en la página de equipos
    if (window.location.hash === '#equipment') {
        setTimeout(() => {
            const isHealthy = checkEquipmentHealth();
            const listenersOk = checkEventListeners();
            
            if (!isHealthy || !listenersOk) {
                console.log('⚠️ Problemas detectados después de navegación, aplicando correcciones...');
                autoFix();
            }
        }, 1000);
    }
}

// Exportar funciones
window.checkEquipmentHealth = checkEquipmentHealth;
window.checkEventListeners = checkEventListeners;
window.autoFix = autoFix;
window.startMonitoring = startMonitoring;
window.checkAndFixOnLoad = checkAndFixOnLoad;
window.checkAfterNavigation = checkAfterNavigation;

// Inicializar auto-corrección
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Auto-corrección inicializada');
    console.log('📝 Comandos disponibles:');
    console.log('   - checkEquipmentHealth() - Verificar salud de Equipment');
    console.log('   - checkEventListeners() - Verificar event listeners');
    console.log('   - autoFix() - Aplicar correcciones automáticas');
    console.log('   - startMonitoring() - Iniciar monitoreo continuo');
    console.log('   - checkAndFixOnLoad() - Verificar al cargar');
    console.log('   - checkAfterNavigation() - Verificar después de navegación');
    
    // Verificar al cargar
    checkAndFixOnLoad();
    
    // Iniciar monitoreo
    startMonitoring();
});

// Escuchar cambios de hash para verificar después de navegación
window.addEventListener('hashchange', () => {
    checkAfterNavigation();
});

console.log('✅ Script de auto-corrección cargado. Se ejecutará automáticamente.'); 
