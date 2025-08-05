/**
 * Script de prueba para verificar el funcionamiento de filtros y búsqueda
 */

console.log('🧪 Script de prueba de filtros cargado');

// Función para probar búsqueda
function testSearch() {
    console.log('🔍 Probando búsqueda...');
    
    const searchInput = document.getElementById('search-equipment');
    if (searchInput) {
        console.log('✅ Campo de búsqueda encontrado');
        
        // Simular búsqueda
        searchInput.value = 'test';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log('📝 Búsqueda simulada con valor: "test"');
        console.log('💡 Verifica en la consola del navegador si se ejecuta loadEquipmentList()');
    } else {
        console.error('❌ Campo de búsqueda no encontrado');
    }
}

// Función para probar filtro de tipo
function testTypeFilter() {
    console.log('🔍 Probando filtro de tipo...');
    
    const typeFilter = document.getElementById('filter-type-status');
    if (typeFilter) {
        console.log('✅ Filtro de tipo encontrado');
        
        // Simular selección de tipo
        typeFilter.value = 'type:desktop';
        typeFilter.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('📝 Filtro de tipo simulado: desktop');
        console.log('💡 Verifica en la consola del navegador si se ejecuta loadEquipmentList()');
    } else {
        console.error('❌ Filtro de tipo no encontrado');
    }
}

// Función para probar filtro de estado
function testStatusFilter() {
    console.log('🔍 Probando filtro de estado...');
    
    const statusFilter = document.getElementById('filter-type-status');
    if (statusFilter) {
        console.log('✅ Filtro de estado encontrado');
        
        // Simular selección de estado
        statusFilter.value = 'status:active';
        statusFilter.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('📝 Filtro de estado simulado: active');
        console.log('💡 Verifica en la consola del navegador si se ejecuta loadEquipmentList()');
    } else {
        console.error('❌ Filtro de estado no encontrado');
    }
}

// Función para probar filtro de ubicación
function testStateFilter() {
    console.log('🔍 Probando filtro de ubicación...');
    
    const stateFilter = document.getElementById('filter-state');
    if (stateFilter) {
        console.log('✅ Filtro de ubicación encontrado');
        
        // Verificar si hay opciones disponibles
        if (stateFilter.options.length > 1) {
            // Simular selección de ubicación
            stateFilter.value = 'capital';
            stateFilter.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log('📝 Filtro de ubicación simulado: capital');
            console.log('💡 Verifica en la consola del navegador si se ejecuta loadEquipmentList()');
        } else {
            console.warn('⚠️ No hay opciones de ubicación disponibles');
        }
    } else {
        console.error('❌ Filtro de ubicación no encontrado');
    }
}

// Función para limpiar filtros
function clearAllFilters() {
    console.log('🧹 Limpiando todos los filtros...');
    
    // Limpiar búsqueda
    const searchInput = document.getElementById('search-equipment');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Limpiar filtro de tipo/estado
    const typeStatusFilter = document.getElementById('filter-type-status');
    if (typeStatusFilter) {
        typeStatusFilter.value = '';
        typeStatusFilter.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Limpiar filtro de ubicación
    const stateFilter = document.getElementById('filter-state');
    if (stateFilter) {
        stateFilter.value = '';
        stateFilter.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    console.log('✅ Todos los filtros limpiados');
}

// Función para verificar estado de filtros
function checkFilterState() {
    console.log('🔍 Verificando estado de filtros...');
    
    const searchInput = document.getElementById('search-equipment');
    const typeStatusFilter = document.getElementById('filter-type-status');
    const stateFilter = document.getElementById('filter-state');
    
    console.log('📊 Estado actual de filtros:');
    console.log('   - Búsqueda:', searchInput ? searchInput.value : 'No encontrado');
    console.log('   - Tipo/Estado:', typeStatusFilter ? typeStatusFilter.value : 'No encontrado');
    console.log('   - Ubicación:', stateFilter ? stateFilter.value : 'No encontrado');
    
    // Verificar si Equipment está disponible
    if (window.Equipment) {
        console.log('   - Filtros en Equipment:', window.Equipment.filters);
    } else {
        console.warn('⚠️ Equipment no está disponible');
    }
}

// Función para monitorear llamadas a loadEquipmentList
function monitorLoadEquipmentList() {
    console.log('👀 Monitoreando llamadas a loadEquipmentList...');
    
    if (window.Equipment && window.Equipment.loadEquipmentList) {
        const originalLoadEquipmentList = window.Equipment.loadEquipmentList;
        
        window.Equipment.loadEquipmentList = function(...args) {
            console.log('🚨 DETECTADO: Llamada a loadEquipmentList()');
            console.log('📍 Argumentos:', args);
            console.log('🔍 Filtros actuales:', this.filters);
            
            return originalLoadEquipmentList.apply(this, args);
        };
        
        console.log('✅ Monitoreo de loadEquipmentList activado');
    } else {
        console.warn('⚠️ Equipment.loadEquipmentList no disponible');
    }
}

// Función para verificar elementos del DOM
function checkDOMElements() {
    console.log('🔍 Verificando elementos del DOM...');
    
    const elements = [
        'search-equipment',
        'filter-type-status',
        'filter-state',
        'active-filters',
        'equipment-tbody'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id}: Encontrado`);
        } else {
            console.error(`❌ ${id}: No encontrado`);
        }
    });
}

// Función para verificar event listeners
function checkEventListeners() {
    console.log('🔍 Verificando event listeners...');
    
    const searchInput = document.getElementById('search-equipment');
    const typeStatusFilter = document.getElementById('filter-type-status');
    const stateFilter = document.getElementById('filter-state');
    
    // Verificar si los elementos tienen event listeners
    if (searchInput) {
        console.log('✅ Campo de búsqueda encontrado');
        console.log('   - Valor actual:', searchInput.value);
        console.log('   - Event listeners:', getEventListeners(searchInput));
    } else {
        console.error('❌ Campo de búsqueda no encontrado');
    }
    
    if (typeStatusFilter) {
        console.log('✅ Filtro tipo/estado encontrado');
        console.log('   - Valor actual:', typeStatusFilter.value);
        console.log('   - Opciones disponibles:', typeStatusFilter.options.length);
        console.log('   - Event listeners:', getEventListeners(typeStatusFilter));
    } else {
        console.error('❌ Filtro tipo/estado no encontrado');
    }
    
    if (stateFilter) {
        console.log('✅ Filtro estado encontrado');
        console.log('   - Valor actual:', stateFilter.value);
        console.log('   - Opciones disponibles:', stateFilter.options.length);
        console.log('   - Event listeners:', getEventListeners(stateFilter));
    } else {
        console.error('❌ Filtro estado no encontrado');
    }
}

// Función para obtener event listeners (aproximación)
function getEventListeners(element) {
    const listeners = [];
    
    // Verificar si el elemento tiene propiedades que indiquen event listeners
    if (element._listeners) {
        listeners.push('_listeners presente');
    }
    
    // Verificar si hay propiedades específicas
    const props = Object.getOwnPropertyNames(element);
    const eventProps = props.filter(prop => prop.includes('on') || prop.includes('listener'));
    if (eventProps.length > 0) {
        listeners.push(`Propiedades de eventos: ${eventProps.join(', ')}`);
    }
    
    return listeners.length > 0 ? listeners : ['No detectados'];
}

// Función para simular eventos de manera más directa
function testSearchDirect() {
    console.log('🔍 Probando búsqueda directa...');
    
    const searchInput = document.getElementById('search-equipment');
    if (searchInput) {
        console.log('✅ Campo de búsqueda encontrado');
        
        // Simular búsqueda de manera más directa
        searchInput.value = 'test';
        
        // Crear y disparar evento de manera más específica
        const inputEvent = new Event('input', { 
            bubbles: true, 
            cancelable: true,
            composed: true
        });
        
        console.log('📝 Disparando evento input...');
        searchInput.dispatchEvent(inputEvent);
        
        // Verificar si el valor se estableció
        console.log('📝 Valor después del evento:', searchInput.value);
        
        // Verificar si Equipment está disponible y tiene el filtro
        if (window.Equipment) {
            console.log('📝 Filtros en Equipment después del evento:', window.Equipment.filters);
        }
        
        console.log('💡 Verifica en la consola si se ejecuta loadEquipmentList()');
    } else {
        console.error('❌ Campo de búsqueda no encontrado');
    }
}

// Función para verificar si Equipment está inicializado correctamente
function checkEquipmentInitialization() {
    console.log('🔍 Verificando inicialización de Equipment...');
    
    if (window.Equipment) {
        console.log('✅ Equipment está disponible');
        console.log('   - Constructor:', window.Equipment.constructor.name);
        console.log('   - Filtros actuales:', window.Equipment.filters);
        console.log('   - Página actual:', window.Equipment.currentPage);
        console.log('   - Items por página:', window.Equipment.itemsPerPage);
        
        // Verificar métodos
        const methods = [
            'setupCompactFilters',
            'loadEquipmentList',
            'updateActiveFilters',
            'debounce'
        ];
        
        methods.forEach(method => {
            if (typeof window.Equipment[method] === 'function') {
                console.log(`   ✅ Método ${method}: Disponible`);
            } else {
                console.error(`   ❌ Método ${method}: No disponible`);
            }
        });
        
    } else {
        console.error('❌ Equipment no está disponible');
    }
}

// Función para forzar la configuración de filtros
function forceSetupFilters() {
    console.log('🔧 Forzando configuración de filtros...');
    
    if (window.Equipment && typeof window.Equipment.setupCompactFilters === 'function') {
        console.log('📝 Llamando setupCompactFilters...');
        window.Equipment.setupCompactFilters();
        console.log('✅ setupCompactFilters ejecutado');
        
        // Verificar elementos después de la configuración
        setTimeout(() => {
            checkEventListeners();
        }, 100);
    } else {
        console.error('❌ Equipment o setupCompactFilters no disponible');
    }
}

// Función para verificar el contexto de this en los event listeners
function testThisContext() {
    console.log('🔍 Probando contexto de this...');
    
    if (window.Equipment) {
        // Crear una función de prueba que simule el contexto
        const testFunction = function() {
            console.log('📝 Contexto de this en función de prueba:');
            console.log('   - this:', this);
            console.log('   - this.filters:', this.filters);
            console.log('   - this.currentPage:', this.currentPage);
        };
        
        // Ejecutar con el contexto de Equipment
        testFunction.call(window.Equipment);
    } else {
        console.error('❌ Equipment no disponible para prueba de contexto');
    }
}

// Inicializar monitoreo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Script de prueba de filtros cargado');
    console.log('📝 Comandos disponibles:');
    console.log('   - testSearch() - Probar búsqueda');
    console.log('   - testTypeFilter() - Probar filtro de tipo');
    console.log('   - testStatusFilter() - Probar filtro de estado');
    console.log('   - testStateFilter() - Probar filtro de ubicación');
    console.log('   - clearAllFilters() - Limpiar todos los filtros');
    console.log('   - checkFilterState() - Verificar estado de filtros');
    console.log('   - checkDOMElements() - Verificar elementos del DOM');
    console.log('   - checkEventListeners() - Verificar event listeners');
    console.log('   - testSearchDirect() - Probar búsqueda directa');
    console.log('   - checkEquipmentInitialization() - Verificar inicialización');
    console.log('   - forceSetupFilters() - Forzar configuración de filtros');
    console.log('   - testThisContext() - Probar contexto de this');
    
    // Verificar elementos del DOM y Equipment
    setTimeout(() => {
        checkDOMElements();
        checkEquipmentInitialization();
        monitorLoadEquipmentList();
    }, 1000);
});

// Exportar funciones para uso manual
window.testSearch = testSearch;
window.testTypeFilter = testTypeFilter;
window.testStatusFilter = testStatusFilter;
window.testStateFilter = testStateFilter;
window.clearAllFilters = clearAllFilters;
window.checkFilterState = checkFilterState;
window.checkDOMElements = checkDOMElements;
window.checkEventListeners = checkEventListeners;
window.testSearchDirect = testSearchDirect;
window.checkEquipmentInitialization = checkEquipmentInitialization;
window.forceSetupFilters = forceSetupFilters;
window.testThisContext = testThisContext;

console.log('✅ Script de prueba cargado. Usa los comandos para probar los filtros.'); 
