/**
 * Script de diagnóstico específico para filtros
 */

console.log('🔍 Script de diagnóstico de filtros cargado');

// Función para verificar si Equipment se inicializa
function diagnoseEquipmentInit() {
    console.log('🔍 Diagnóstico de inicialización de Equipment...');
    
    // Verificar si Equipment existe
    if (!window.Equipment) {
        console.error('❌ Equipment no está disponible en window');
        return false;
    }
    
    console.log('✅ Equipment está disponible');
    console.log('   - Tipo:', typeof window.Equipment);
    console.log('   - Constructor:', window.Equipment.constructor.name);
    
    // Verificar si es una instancia válida
    if (window.Equipment instanceof Equipment) {
        console.log('✅ Equipment es una instancia válida');
    } else {
        console.warn('⚠️ Equipment no es una instancia de la clase Equipment');
    }
    
    // Verificar propiedades críticas
    console.log('📊 Propiedades críticas:');
    console.log('   - filters:', window.Equipment.filters);
    console.log('   - currentPage:', window.Equipment.currentPage);
    console.log('   - stateMapping:', window.Equipment.stateMapping);
    
    // Verificar métodos críticos
    const criticalMethods = [
        'setupCompactFilters',
        'loadEquipmentList',
        'updateActiveFilters',
        'init',
        'setupEventListeners'
    ];
    
    console.log('🔧 Métodos críticos:');
    criticalMethods.forEach(method => {
        if (typeof window.Equipment[method] === 'function') {
            console.log(`   ✅ ${method}: Disponible`);
        } else {
            console.error(`   ❌ ${method}: No disponible`);
        }
    });
    
    return true;
}

// Función para verificar elementos del DOM
function diagnoseDOMElements() {
    console.log('🔍 Diagnóstico de elementos del DOM...');
    
    const criticalElements = [
        { id: 'search-equipment', type: 'input', required: true },
        { id: 'filter-type-status', type: 'select', required: true },
        { id: 'filter-state', type: 'select', required: true },
        { id: 'active-filters', type: 'div', required: true },
        { id: 'equipment-tbody', type: 'tbody', required: true }
    ];
    
    let allFound = true;
    
    criticalElements.forEach(element => {
        const domElement = document.getElementById(element.id);
        if (domElement) {
            console.log(`✅ ${element.id} (${element.type}): Encontrado`);
            console.log(`   - Valor: ${domElement.value || 'N/A'}`);
            console.log(`   - Visible: ${domElement.offsetParent !== null}`);
            if (element.type === 'select') {
                console.log(`   - Opciones: ${domElement.options ? domElement.options.length : 'N/A'}`);
            }
        } else {
            console.error(`❌ ${element.id} (${element.type}): No encontrado`);
            if (element.required) {
                allFound = false;
            }
        }
    });
    
    return allFound;
}

// Función para verificar event listeners
function diagnoseEventListeners() {
    console.log('🔍 Diagnóstico de event listeners...');
    
    const searchInput = document.getElementById('search-equipment');
    const typeStatusFilter = document.getElementById('filter-type-status');
    const stateFilter = document.getElementById('filter-state');
    
    if (!searchInput || !typeStatusFilter || !stateFilter) {
        console.error('❌ Elementos de filtro no encontrados');
        return false;
    }
    
    console.log('✅ Elementos de filtro encontrados');
    
    // Verificar si los elementos tienen event listeners
    console.log('📝 Verificando event listeners...');
    
    // Probar búsqueda
    console.log('🧪 Probando event listener de búsqueda...');
    searchInput.value = 'test';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Probar filtro tipo
    console.log('🧪 Probando event listener de filtro tipo...');
    if (typeStatusFilter.options.length > 1) {
        typeStatusFilter.value = 'type:desktop';
        typeStatusFilter.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Probar filtro estado
    console.log('🧪 Probando event listener de filtro estado...');
    if (stateFilter.options.length > 1) {
        stateFilter.value = 'capital';
        stateFilter.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    console.log('✅ Pruebas de event listeners completadas');
    return true;
}

// Función para verificar si Equipment se inicializa automáticamente
function diagnoseAutoInit() {
    console.log('🔍 Diagnóstico de inicialización automática...');
    
    // Verificar si Equipment se inicializa cuando se carga la página
    if (window.Equipment && typeof window.Equipment.init === 'function') {
        console.log('✅ Equipment.init está disponible');
        
        // Verificar si ya se ejecutó init
        console.log('📝 Verificando si init ya se ejecutó...');
        
        // Intentar llamar init manualmente
        console.log('📝 Llamando Equipment.init() manualmente...');
        window.Equipment.init();
        
        // Verificar después de init
        setTimeout(() => {
            console.log('📊 Estado después de init:');
            console.log('   - Filtros:', window.Equipment.filters);
            console.log('   - Página actual:', window.Equipment.currentPage);
        }, 500);
        
    } else {
        console.error('❌ Equipment.init no disponible');
    }
}

// Función para forzar inicialización
function forceInit() {
    console.log('🔧 Forzando inicialización de Equipment...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no disponible');
        return;
    }
    
    // Limpiar filtros primero
    window.Equipment.filters = {
        search: '',
        type: '',
        status: '',
        state: ''
    };
    
    // Llamar init
    if (typeof window.Equipment.init === 'function') {
        console.log('📝 Llamando Equipment.init()...');
        window.Equipment.init();
        console.log('✅ Equipment.init() ejecutado');
        
        // Verificar después de la inicialización
        setTimeout(() => {
            diagnoseEquipmentInit();
            diagnoseDOMElements();
        }, 1000);
    } else {
        console.error('❌ Equipment.init no disponible');
    }
}

// Función para verificar el contexto de this
function diagnoseThisContext() {
    console.log('🔍 Diagnóstico de contexto this...');
    
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
        console.log('   - this.setupCompactFilters:', typeof this.setupCompactFilters);
    };
    
    // Ejecutar con el contexto de Equipment
    testFunction.call(window.Equipment);
}

// Función para ejecutar diagnóstico completo
function runFullDiagnosis() {
    console.log('🚀 Ejecutando diagnóstico completo...');
    
    console.log('=== PASO 1: Verificar Equipment ===');
    const equipmentOk = diagnoseEquipmentInit();
    
    console.log('=== PASO 2: Verificar elementos DOM ===');
    const domOk = diagnoseDOMElements();
    
    console.log('=== PASO 3: Verificar inicialización automática ===');
    diagnoseAutoInit();
    
    console.log('=== PASO 4: Verificar contexto this ===');
    diagnoseThisContext();
    
    console.log('=== PASO 5: Probar event listeners ===');
    if (equipmentOk && domOk) {
        diagnoseEventListeners();
    }
    
    console.log('✅ Diagnóstico completo finalizado');
    console.log('💡 Si hay problemas, ejecuta forceInit() para forzar inicialización');
}

// Exportar funciones
window.diagnoseEquipmentInit = diagnoseEquipmentInit;
window.diagnoseDOMElements = diagnoseDOMElements;
window.diagnoseEventListeners = diagnoseEventListeners;
window.diagnoseAutoInit = diagnoseAutoInit;
window.forceInit = forceInit;
window.diagnoseThisContext = diagnoseThisContext;
window.runFullDiagnosis = runFullDiagnosis;

// Inicializar diagnóstico
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Script de diagnóstico inicializado');
    console.log('📝 Comandos disponibles:');
    console.log('   - runFullDiagnosis() - Ejecutar diagnóstico completo');
    console.log('   - diagnoseEquipmentInit() - Verificar Equipment');
    console.log('   - diagnoseDOMElements() - Verificar elementos DOM');
    console.log('   - diagnoseEventListeners() - Verificar event listeners');
    console.log('   - forceInit() - Forzar inicialización');
    console.log('   - diagnoseThisContext() - Verificar contexto this');
    
    // Ejecutar diagnóstico automático después de un delay
    setTimeout(() => {
        console.log('🔍 Ejecutando diagnóstico automático...');
        runFullDiagnosis();
    }, 2000);
});

console.log('✅ Script de diagnóstico cargado. Usa runFullDiagnosis() para diagnóstico completo.'); 
