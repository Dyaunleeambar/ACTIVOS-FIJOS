/**
 * Script de debugging específico para filtros
 */

console.log('🔧 Script de debugging de filtros cargado');

// Función para verificar si Equipment se inicializa correctamente
function debugEquipmentInit() {
    console.log('🔍 Debugging inicialización de Equipment...');
    
    // Verificar si Equipment existe
    if (!window.Equipment) {
        console.error('❌ Equipment no está disponible');
        return;
    }
    
    console.log('✅ Equipment está disponible');
    console.log('   - Tipo:', typeof window.Equipment);
    console.log('   - Constructor:', window.Equipment.constructor.name);
    
    // Verificar si es una instancia
    if (window.Equipment instanceof Equipment) {
        console.log('✅ Equipment es una instancia válida');
    } else {
        console.warn('⚠️ Equipment no es una instancia de la clase Equipment');
    }
    
    // Verificar propiedades
    console.log('📊 Propiedades de Equipment:');
    console.log('   - filters:', window.Equipment.filters);
    console.log('   - currentPage:', window.Equipment.currentPage);
    console.log('   - itemsPerPage:', window.Equipment.itemsPerPage);
    console.log('   - stateMapping:', window.Equipment.stateMapping);
    
    // Verificar métodos
    const methods = [
        'setupCompactFilters',
        'loadEquipmentList',
        'updateActiveFilters',
        'init',
        'setupEventListeners'
    ];
    
    console.log('🔧 Métodos disponibles:');
    methods.forEach(method => {
        if (typeof window.Equipment[method] === 'function') {
            console.log(`   ✅ ${method}: Disponible`);
        } else {
            console.error(`   ❌ ${method}: No disponible`);
        }
    });
}

// Función para verificar elementos del DOM
function debugDOMElements() {
    console.log('🔍 Debugging elementos del DOM...');
    
    const elements = [
        { id: 'search-equipment', type: 'input' },
        { id: 'filter-type-status', type: 'select' },
        { id: 'filter-state', type: 'select' },
        { id: 'active-filters', type: 'div' },
        { id: 'equipment-tbody', type: 'tbody' }
    ];
    
    elements.forEach(element => {
        const domElement = document.getElementById(element.id);
        if (domElement) {
            console.log(`✅ ${element.id} (${element.type}): Encontrado`);
            console.log(`   - Valor: ${domElement.value || 'N/A'}`);
            console.log(`   - Visible: ${domElement.offsetParent !== null}`);
            console.log(`   - Opciones: ${domElement.options ? domElement.options.length : 'N/A'}`);
        } else {
            console.error(`❌ ${element.id} (${element.type}): No encontrado`);
        }
    });
}

// Función para verificar event listeners
function debugEventListeners() {
    console.log('🔍 Debugging event listeners...');
    
    const searchInput = document.getElementById('search-equipment');
    const typeStatusFilter = document.getElementById('filter-type-status');
    const stateFilter = document.getElementById('filter-state');
    
    // Verificar si los elementos existen
    if (!searchInput || !typeStatusFilter || !stateFilter) {
        console.error('❌ Algunos elementos de filtro no encontrados');
        return;
    }
    
    console.log('✅ Todos los elementos de filtro encontrados');
    console.log('   - Campo de búsqueda:', searchInput ? 'Disponible' : 'No encontrado');
    console.log('   - Filtro tipo/estado:', typeStatusFilter ? 'Disponible' : 'No encontrado');
    console.log('   - Filtro estado:', stateFilter ? 'Disponible' : 'No encontrado');
    
    // NO aplicar filtros automáticamente, solo verificar que los elementos existen
    console.log('📝 Los event listeners están configurados y listos para usar');
    console.log('💡 Para probar manualmente:');
    console.log('   - Escribe en el campo de búsqueda');
    console.log('   - Selecciona opciones en los filtros');
    console.log('   - Verifica que se ejecute loadEquipmentList()');
}

// Función para forzar reinicialización
function forceReinit() {
    console.log('🔧 Forzando reinicialización de Equipment...');
    
    if (window.Equipment && typeof window.Equipment.init === 'function') {
        console.log('📝 Llamando Equipment.init()...');
        window.Equipment.init();
        console.log('✅ Equipment.init() ejecutado');
        
        // Verificar después de la inicialización
        setTimeout(() => {
            debugEquipmentInit();
            debugDOMElements();
        }, 500);
    } else {
        console.error('❌ Equipment o método init no disponible');
    }
}

// Función para verificar el contexto de this
function debugThisContext() {
    console.log('🔍 Debugging contexto de this...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no disponible');
        return;
    }
    
    // Crear una función de prueba
    const testFunction = function() {
        console.log('📝 Contexto de this en función de prueba:');
        console.log('   - this:', this);
        console.log('   - this.filters:', this.filters);
        console.log('   - this.currentPage:', this.currentPage);
        console.log('   - this.loadEquipmentList:', typeof this.loadEquipmentList);
    };
    
    // Ejecutar con el contexto de Equipment
    testFunction.call(window.Equipment);
}

// Función para verificar si los filtros se actualizan
function debugFilterUpdates() {
    console.log('🔍 Debugging actualizaciones de filtros...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no disponible');
        return;
    }
    
    console.log('📊 Estado actual de filtros:', window.Equipment.filters);
    
    // NO aplicar filtros automáticamente, solo verificar el estado
    console.log('✅ Estado de filtros verificado');
    console.log('💡 Para probar manualmente:');
    console.log('   - Modifica los filtros en la interfaz');
    console.log('   - Verifica que se ejecute loadEquipmentList()');
    console.log('   - Verifica que los chips de filtros se actualicen');
    
    // Verificar si loadEquipmentList se ejecuta
    const originalLoadEquipmentList = window.Equipment.loadEquipmentList;
    window.Equipment.loadEquipmentList = function(...args) {
        console.log('🚨 DETECTADO: Llamada a loadEquipmentList()');
        console.log('📍 Argumentos:', args);
        console.log('🔍 Filtros actuales:', this.filters);
        return originalLoadEquipmentList.apply(this, args);
    };
    
    console.log('✅ Monitoreo de loadEquipmentList activado');
}

// Función para verificar la página actual
function debugCurrentPage() {
    console.log('🔍 Debugging página actual...');
    
    console.log('📍 Hash actual:', window.location.hash);
    console.log('📍 URL completa:', window.location.href);
    
    // Verificar si estamos en la página de equipos
    if (window.location.hash === '#equipment') {
        console.log('✅ Estamos en la página de equipos');
    } else {
        console.warn('⚠️ No estamos en la página de equipos');
        console.log('💡 Navega a #equipment para probar los filtros');
    }
}

// Función para ejecutar todas las verificaciones
function runAllDebugChecks() {
    console.log('🚀 Ejecutando todas las verificaciones de debugging...');
    
    debugCurrentPage();
    debugEquipmentInit();
    debugDOMElements();
    debugEventListeners();
    debugThisContext();
    debugFilterUpdates();
    
    console.log('✅ Todas las verificaciones completadas');
}

// Exportar funciones para uso manual
window.debugEquipmentInit = debugEquipmentInit;
window.debugDOMElements = debugDOMElements;
window.debugEventListeners = debugEventListeners;
window.forceReinit = forceReinit;
window.debugThisContext = debugThisContext;
window.debugFilterUpdates = debugFilterUpdates;
window.runAllDebugChecks = runAllDebugChecks;

// Inicializar debugging
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Script de debugging de filtros inicializado');
    console.log('📝 Comandos disponibles:');
    console.log('   - debugEquipmentInit() - Verificar inicialización');
    console.log('   - debugDOMElements() - Verificar elementos DOM');
    console.log('   - debugEventListeners() - Verificar event listeners');
    console.log('   - forceReinit() - Forzar reinicialización');
    console.log('   - debugThisContext() - Verificar contexto this');
    console.log('   - debugFilterUpdates() - Verificar actualizaciones');
    console.log('   - runAllDebugChecks() - Ejecutar todas las verificaciones');
    
    // Ejecutar verificaciones automáticas después de un delay
    setTimeout(() => {
        console.log('🔍 Ejecutando verificaciones automáticas...');
        runAllDebugChecks();
    }, 2000);
});

console.log('✅ Script de debugging cargado. Usa los comandos para diagnosticar problemas.'); 
