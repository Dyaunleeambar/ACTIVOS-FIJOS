/**
 * Script de prueba simple para filtros
 */

console.log('🧪 Script de prueba simple cargado');

// Función para probar búsqueda manual
function testSearchManual() {
    console.log('🔍 Probando búsqueda manual...');
    
    const searchInput = document.getElementById('search-equipment');
    if (!searchInput) {
        console.error('❌ Campo de búsqueda no encontrado');
        return;
    }
    
    console.log('✅ Campo de búsqueda encontrado');
    console.log('📝 Valor actual:', searchInput.value);
    
    // Simular búsqueda
    searchInput.value = 'test';
    console.log('📝 Estableciendo valor: test');
    
    // Disparar evento
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('📝 Evento input disparado');
    
    // Verificar si Equipment está disponible
    if (window.Equipment) {
        console.log('📊 Filtros en Equipment:', window.Equipment.filters);
        console.log('📊 Página actual:', window.Equipment.currentPage);
    } else {
        console.error('❌ Equipment no disponible');
    }
}

// Función para probar filtro tipo manual
function testTypeFilterManual() {
    console.log('🔍 Probando filtro tipo manual...');
    
    const typeFilter = document.getElementById('filter-type-status');
    if (!typeFilter) {
        console.error('❌ Filtro tipo no encontrado');
        return;
    }
    
    console.log('✅ Filtro tipo encontrado');
    console.log('📝 Valor actual:', typeFilter.value);
    console.log('📝 Opciones disponibles:', typeFilter.options.length);
    
    // Simular selección
    typeFilter.value = 'type:desktop';
    console.log('📝 Estableciendo valor: type:desktop');
    
    // Disparar evento
    typeFilter.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('📝 Evento change disparado');
    
    // Verificar si Equipment está disponible
    if (window.Equipment) {
        console.log('📊 Filtros en Equipment:', window.Equipment.filters);
    } else {
        console.error('❌ Equipment no disponible');
    }
}

// Función para probar filtro estado manual
function testStateFilterManual() {
    console.log('🔍 Probando filtro estado manual...');
    
    const stateFilter = document.getElementById('filter-state');
    if (!stateFilter) {
        console.error('❌ Filtro estado no encontrado');
        return;
    }
    
    console.log('✅ Filtro estado encontrado');
    console.log('📝 Valor actual:', stateFilter.value);
    console.log('📝 Opciones disponibles:', stateFilter.options.length);
    
    // Simular selección
    if (stateFilter.options.length > 1) {
        stateFilter.value = 'capital';
        console.log('📝 Estableciendo valor: capital');
        
        // Disparar evento
        stateFilter.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('📝 Evento change disparado');
        
        // Verificar si Equipment está disponible
        if (window.Equipment) {
            console.log('📊 Filtros en Equipment:', window.Equipment.filters);
        } else {
            console.error('❌ Equipment no disponible');
        }
    } else {
        console.warn('⚠️ No hay opciones disponibles en el filtro estado');
    }
}

// Función para verificar estado actual
function checkCurrentState() {
    console.log('🔍 Verificando estado actual...');
    
    console.log('📍 Hash actual:', window.location.hash);
    console.log('📍 URL completa:', window.location.href);
    
    // Verificar Equipment
    if (window.Equipment) {
        console.log('✅ Equipment disponible');
        console.log('📊 Filtros:', window.Equipment.filters);
        console.log('📊 Página actual:', window.Equipment.currentPage);
    } else {
        console.error('❌ Equipment no disponible');
    }
    
    // Verificar elementos del DOM
    const searchInput = document.getElementById('search-equipment');
    const typeFilter = document.getElementById('filter-type-status');
    const stateFilter = document.getElementById('filter-state');
    
    console.log('📝 Elementos del DOM:');
    console.log('   - Campo búsqueda:', searchInput ? 'Encontrado' : 'No encontrado');
    console.log('   - Filtro tipo:', typeFilter ? 'Encontrado' : 'No encontrado');
    console.log('   - Filtro estado:', stateFilter ? 'Encontrado' : 'No encontrado');
}

// Función para limpiar y reinicializar
function cleanAndReinit() {
    console.log('🧹 Limpiando y reinicializando...');
    
    // Limpiar filtros
    if (window.Equipment) {
        window.Equipment.filters = {
            search: '',
            type: '',
            status: '',
            state: ''
        };
        console.log('✅ Filtros limpiados');
    }
    
    // Limpiar inputs
    const searchInput = document.getElementById('search-equipment');
    if (searchInput) searchInput.value = '';
    
    const typeFilter = document.getElementById('filter-type-status');
    if (typeFilter) typeFilter.value = '';
    
    const stateFilter = document.getElementById('filter-state');
    if (stateFilter) stateFilter.value = '';
    
    console.log('✅ Inputs limpiados');
    
    // Reinicializar Equipment
    if (window.Equipment && typeof window.Equipment.init === 'function') {
        console.log('📝 Llamando Equipment.init()...');
        window.Equipment.init();
        console.log('✅ Equipment reinicializado');
    } else {
        console.error('❌ Equipment o init no disponible');
    }
}

// Exportar funciones
window.testSearchManual = testSearchManual;
window.testTypeFilterManual = testTypeFilterManual;
window.testStateFilterManual = testStateFilterManual;
window.checkCurrentState = checkCurrentState;
window.cleanAndReinit = cleanAndReinit;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧪 Script de prueba simple inicializado');
    console.log('📝 Comandos disponibles:');
    console.log('   - testSearchManual() - Probar búsqueda manual');
    console.log('   - testTypeFilterManual() - Probar filtro tipo manual');
    console.log('   - testStateFilterManual() - Probar filtro estado manual');
    console.log('   - checkCurrentState() - Verificar estado actual');
    console.log('   - cleanAndReinit() - Limpiar y reinicializar');
    
    // Verificar estado después de un delay
    setTimeout(() => {
        console.log('🔍 Verificando estado inicial...');
        checkCurrentState();
    }, 1000);
});

console.log('✅ Script de prueba simple cargado. Usa los comandos para probar manualmente.'); 
