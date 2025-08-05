/**
 * Script para limpiar filtros automáticos y reinicializar correctamente
 */

console.log('🧹 Script de limpieza de filtros cargado');

// Función para limpiar todos los filtros automáticos
function cleanAllFilters() {
    console.log('🧹 Limpiando todos los filtros automáticos...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no disponible');
        return;
    }
    
    // Limpiar filtros en el objeto Equipment
    window.Equipment.filters = {
        search: '',
        type: '',
        status: '',
        state: ''
    };
    
    // Limpiar inputs en el DOM
    const searchInput = document.getElementById('search-equipment');
    if (searchInput) {
        searchInput.value = '';
        console.log('✅ Campo de búsqueda limpiado');
    }
    
    const typeStatusFilter = document.getElementById('filter-type-status');
    if (typeStatusFilter) {
        typeStatusFilter.value = '';
        console.log('✅ Filtro tipo/estado limpiado');
    }
    
    const stateFilter = document.getElementById('filter-state');
    if (stateFilter) {
        stateFilter.value = '';
        console.log('✅ Filtro estado limpiado');
    }
    
    // Limpiar chips de filtros activos
    const activeFiltersContainer = document.getElementById('active-filters');
    if (activeFiltersContainer) {
        activeFiltersContainer.innerHTML = '';
        console.log('✅ Chips de filtros limpiados');
    }
    
    // Resetear página a 1
    window.Equipment.currentPage = 1;
    
    // Recargar lista de equipos sin filtros
    console.log('📝 Recargando lista de equipos sin filtros...');
    window.Equipment.loadEquipmentList();
    
    console.log('✅ Todos los filtros han sido limpiados');
}

// Función para reinicializar Equipment correctamente
function reinitEquipment() {
    console.log('🔧 Reinicializando Equipment...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no disponible');
        return;
    }
    
    // Limpiar filtros primero
    cleanAllFilters();
    
    // Reinicializar
    if (typeof window.Equipment.init === 'function') {
        console.log('📝 Llamando Equipment.init()...');
        window.Equipment.init();
        console.log('✅ Equipment reinicializado');
    } else {
        console.error('❌ Equipment.init no disponible');
    }
}

// Función para verificar el estado actual
function checkCurrentState() {
    console.log('🔍 Verificando estado actual...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no disponible');
        return;
    }
    
    console.log('📊 Estado actual:');
    console.log('   - Filtros:', window.Equipment.filters);
    console.log('   - Página actual:', window.Equipment.currentPage);
    console.log('   - Hash actual:', window.location.hash);
    
    // Verificar elementos del DOM
    const searchInput = document.getElementById('search-equipment');
    const typeStatusFilter = document.getElementById('filter-type-status');
    const stateFilter = document.getElementById('filter-state');
    
    console.log('📝 Elementos del DOM:');
    console.log('   - Campo búsqueda:', searchInput ? searchInput.value : 'No encontrado');
    console.log('   - Filtro tipo/estado:', typeStatusFilter ? typeStatusFilter.value : 'No encontrado');
    console.log('   - Filtro estado:', stateFilter ? stateFilter.value : 'No encontrado');
}

// Función para deshabilitar scripts de prueba automáticos
function disableAutoTests() {
    console.log('🚫 Deshabilitando scripts de prueba automáticos...');
    
    // Deshabilitar verificaciones automáticas en debug-filters.js
    if (window.runAllDebugChecks) {
        const originalRunAllDebugChecks = window.runAllDebugChecks;
        window.runAllDebugChecks = function() {
            console.log('🚫 Verificaciones automáticas deshabilitadas');
            console.log('💡 Usa cleanAllFilters() para limpiar filtros automáticos');
        };
        console.log('✅ Scripts automáticos deshabilitados');
    }
}

// Función para habilitar scripts de prueba manuales
function enableManualTests() {
    console.log('✅ Habilitando pruebas manuales...');
    
    console.log('📝 Comandos disponibles:');
    console.log('   - cleanAllFilters() - Limpiar todos los filtros');
    console.log('   - reinitEquipment() - Reinicializar Equipment');
    console.log('   - checkCurrentState() - Verificar estado actual');
    console.log('   - disableAutoTests() - Deshabilitar pruebas automáticas');
    
    console.log('💡 Para probar manualmente:');
    console.log('   1. Ejecuta cleanAllFilters()');
    console.log('   2. Escribe en el campo de búsqueda');
    console.log('   3. Selecciona opciones en los filtros');
    console.log('   4. Verifica que se ejecute loadEquipmentList()');
}

// Exportar funciones
window.cleanAllFilters = cleanAllFilters;
window.reinitEquipment = reinitEquipment;
window.checkCurrentState = checkCurrentState;
window.disableAutoTests = disableAutoTests;
window.enableManualTests = enableManualTests;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧹 Script de limpieza inicializado');
    console.log('📝 Comandos disponibles:');
    console.log('   - cleanAllFilters() - Limpiar todos los filtros');
    console.log('   - reinitEquipment() - Reinicializar Equipment');
    console.log('   - checkCurrentState() - Verificar estado actual');
    console.log('   - disableAutoTests() - Deshabilitar pruebas automáticas');
    console.log('   - enableManualTests() - Habilitar pruebas manuales');
    
    // Deshabilitar verificaciones automáticas por defecto
    setTimeout(() => {
        disableAutoTests();
        console.log('💡 Ejecuta cleanAllFilters() para limpiar filtros automáticos');
    }, 1000);
});

console.log('✅ Script de limpieza cargado. Usa cleanAllFilters() para limpiar filtros automáticos.'); 
