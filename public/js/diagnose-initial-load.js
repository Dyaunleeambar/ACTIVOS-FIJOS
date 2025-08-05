/**
 * Script de diagnóstico para el problema de carga inicial de equipos
 * Diagnostica por qué necesitas hacer clic en "actualizar" después de reiniciar el servidor
 */

console.log('🔍 Script de diagnóstico de carga inicial cargado');

// Función para verificar el estado de inicialización
function diagnoseInitialLoad() {
    console.log('🔍 Diagnóstico de carga inicial...');
    
    // Verificar si estamos en la página de equipos
    const isEquipmentPage = window.location.hash === '#equipment';
    console.log('📍 Página actual:', window.location.hash, '¿Es página de equipos?', isEquipmentPage);
    
    // Verificar si Equipment está disponible
    const equipmentAvailable = window.Equipment && typeof window.Equipment === 'object';
    console.log('🔧 Equipment disponible:', equipmentAvailable);
    
    if (equipmentAvailable) {
        console.log('📊 Estado de Equipment:');
        console.log('   - Filtros:', window.Equipment.filters);
        console.log('   - Página actual:', window.Equipment.currentPage);
        console.log('   - Equipos cargados:', window.Equipment.equipment?.length || 0);
    }
    
    // Verificar si App está disponible
    const appAvailable = window.App && typeof window.App === 'object';
    console.log('📱 App disponible:', appAvailable);
    
    if (appAvailable) {
        console.log('📊 Estado de App:');
        console.log('   - Página actual:', window.App.currentPage);
        console.log('   - Cargando:', window.App.isLoading);
    }
    
    // Verificar elementos del DOM
    const tableContainer = document.getElementById('equipment-table-container');
    const tableBody = document.querySelector('#equipment-table tbody');
    const loadingElement = document.getElementById('equipment-loading');
    
    console.log('📋 Elementos del DOM:');
    console.log('   - Contenedor de tabla:', !!tableContainer);
    console.log('   - Cuerpo de tabla:', !!tableBody);
    console.log('   - Elemento de carga:', !!loadingElement);
    
    if (tableBody) {
        const rows = tableBody.querySelectorAll('tr');
        console.log('   - Filas en tabla:', rows.length);
    }
    
    // Verificar si hay datos en la tabla
    const hasTableData = tableBody && tableBody.children.length > 0;
    console.log('📊 ¿Hay datos en la tabla?', hasTableData);
    
    return {
        isEquipmentPage,
        equipmentAvailable,
        appAvailable,
        hasTableData,
        tableContainer: !!tableContainer,
        tableBody: !!tableBody
    };
}

// Función para verificar el flujo de inicialización
function diagnoseInitializationFlow() {
    console.log('🔄 Diagnóstico del flujo de inicialización...');
    
    // Verificar el orden de carga de scripts
    const scripts = Array.from(document.scripts);
    const equipmentScript = scripts.find(s => s.src && s.src.includes('equipment.js'));
    const appScript = scripts.find(s => s.src && s.src.includes('app.js'));
    const authScript = scripts.find(s => s.src && s.src.includes('auth.js'));
    
    console.log('📜 Scripts cargados:');
    console.log('   - equipment.js:', !!equipmentScript);
    console.log('   - app.js:', !!appScript);
    console.log('   - auth.js:', !!authScript);
    
    // Verificar timing de inicialización
    console.log('⏰ Timing de inicialización:');
    console.log('   - DOMContentLoaded ejecutado:', true);
    console.log('   - Equipment.init() llamado:', window.Equipment?.init?.toString().includes('console.log'));
    
    // Verificar si loadEquipmentList fue llamado
    const equipmentListCalled = window.Equipment?.loadEquipmentList?.toString().includes('console.log');
    console.log('   - loadEquipmentList() llamado:', equipmentListCalled);
}

// Función para simular la carga inicial
function simulateInitialLoad() {
    console.log('🧪 Simulando carga inicial...');
    
    if (!window.Equipment) {
        console.error('❌ Equipment no está disponible');
        return;
    }
    
    // Limpiar estado
    console.log('🧹 Limpiando estado...');
    if (window.Equipment.cleanState) {
        window.Equipment.cleanState();
    }
    
    // Cargar equipos
    console.log('📊 Cargando equipos...');
    window.Equipment.loadEquipmentList()
        .then(() => {
            console.log('✅ Carga simulada completada');
            diagnoseInitialLoad();
        })
        .catch(error => {
            console.error('❌ Error en carga simulada:', error);
        });
}

// Función para verificar el problema específico
function checkSpecificIssue() {
    console.log('🎯 Verificando problema específico...');
    
    const diagnosis = diagnoseInitialLoad();
    
    if (diagnosis.isEquipmentPage && diagnosis.equipmentAvailable && !diagnosis.hasTableData) {
        console.log('🚨 PROBLEMA DETECTADO: Estás en la página de equipos, Equipment está disponible, pero no hay datos en la tabla');
        console.log('💡 Esto explica por qué necesitas hacer clic en "actualizar"');
        
        // Verificar si loadEquipmentList fue llamado
        const tableBody = document.querySelector('#equipment-table tbody');
        if (tableBody && tableBody.children.length === 0) {
            console.log('🔍 La tabla está vacía - loadEquipmentList probablemente no se ejecutó correctamente');
            
            // Intentar cargar manualmente
            console.log('🔄 Intentando carga manual...');
            if (window.Equipment.loadEquipmentList) {
                window.Equipment.loadEquipmentList()
                    .then(() => {
                        console.log('✅ Carga manual exitosa');
                        diagnoseInitialLoad();
                    })
                    .catch(error => {
                        console.error('❌ Error en carga manual:', error);
                    });
            }
        }
    } else if (!diagnosis.equipmentAvailable) {
        console.log('🚨 PROBLEMA DETECTADO: Equipment no está disponible');
    } else if (!diagnosis.isEquipmentPage) {
        console.log('ℹ️ No estás en la página de equipos');
    } else {
        console.log('✅ Todo parece estar funcionando correctamente');
    }
}

// Función para verificar el timing de navegación
function checkNavigationTiming() {
    console.log('⏱️ Verificando timing de navegación...');
    
    // Verificar si el hashchange se disparó
    let hashChangeFired = false;
    const originalHashChange = window.onhashchange;
    
    window.addEventListener('hashchange', () => {
        hashChangeFired = true;
        console.log('🔄 Hash change detectado');
    });
    
    // Simular navegación a equipos
    console.log('🧪 Simulando navegación a equipos...');
    window.location.hash = '#equipment';
    
    setTimeout(() => {
        console.log('⏰ Hash change disparado:', hashChangeFired);
        
        // Verificar si App.handleHashChange fue llamado
        if (window.App && window.App.handleHashChange) {
            console.log('✅ App.handleHashChange está disponible');
        } else {
            console.log('❌ App.handleHashChange no está disponible');
        }
        
        // Verificar si loadPageData fue llamado
        if (window.App && window.App.loadPageData) {
            console.log('✅ App.loadPageData está disponible');
        } else {
            console.log('❌ App.loadPageData no está disponible');
        }
    }, 100);
}

// Función para forzar la carga inicial
function forceInitialLoad() {
    console.log('🔧 Forzando carga inicial...');
    
    // Verificar que estamos en la página correcta
    if (window.location.hash !== '#equipment') {
        console.log('📍 Navegando a página de equipos...');
        window.location.hash = '#equipment';
        
        // Esperar a que se complete la navegación
        setTimeout(() => {
            forceInitialLoad();
        }, 200);
        return;
    }
    
    // Verificar que Equipment esté disponible
    if (!window.Equipment) {
        console.error('❌ Equipment no está disponible');
        return;
    }
    
    // Limpiar estado y cargar
    console.log('🧹 Limpiando estado...');
    if (window.Equipment.cleanState) {
        window.Equipment.cleanState();
    }
    
    console.log('📊 Cargando equipos...');
    window.Equipment.loadEquipmentList()
        .then(() => {
            console.log('✅ Carga forzada completada');
            diagnoseInitialLoad();
        })
        .catch(error => {
            console.error('❌ Error en carga forzada:', error);
        });
}

// Función para verificar el problema después del login
function checkPostLoginIssue() {
    console.log('🔐 Verificando problema después del login...');
    
    // Verificar si el usuario está autenticado
    const isAuthenticated = window.Auth && window.Auth.isAuthenticated;
    console.log('🔐 Usuario autenticado:', isAuthenticated);
    
    if (isAuthenticated) {
        console.log('✅ Usuario autenticado, verificando estado de la aplicación...');
        diagnoseInitialLoad();
    } else {
        console.log('❌ Usuario no autenticado');
    }
}

// Función para ejecutar diagnóstico completo
function runCompleteDiagnosis() {
    console.log('🔍 Ejecutando diagnóstico completo...');
    
    console.log('\n=== DIAGNÓSTICO DE CARGA INICIAL ===');
    diagnoseInitialLoad();
    
    console.log('\n=== DIAGNÓSTICO DEL FLUJO DE INICIALIZACIÓN ===');
    diagnoseInitializationFlow();
    
    console.log('\n=== VERIFICACIÓN DEL PROBLEMA ESPECÍFICO ===');
    checkSpecificIssue();
    
    console.log('\n=== VERIFICACIÓN POST-LOGIN ===');
    checkPostLoginIssue();
    
    console.log('\n=== DIAGNÓSTICO COMPLETADO ===');
    console.log('💡 Si el problema persiste, usa forceInitialLoad() para forzar la carga');
}

// Exportar funciones
window.diagnoseInitialLoad = diagnoseInitialLoad;
window.diagnoseInitializationFlow = diagnoseInitializationFlow;
window.simulateInitialLoad = simulateInitialLoad;
window.checkSpecificIssue = checkSpecificIssue;
window.checkNavigationTiming = checkNavigationTiming;
window.forceInitialLoad = forceInitialLoad;
window.checkPostLoginIssue = checkPostLoginIssue;
window.runCompleteDiagnosis = runCompleteDiagnosis;

// Inicializar diagnóstico automático
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Script de diagnóstico de carga inicial inicializado');
    console.log('📝 Comandos disponibles:');
    console.log('   - diagnoseInitialLoad() - Verificar estado actual');
    console.log('   - diagnoseInitializationFlow() - Verificar flujo de inicialización');
    console.log('   - simulateInitialLoad() - Simular carga inicial');
    console.log('   - checkSpecificIssue() - Verificar problema específico');
    console.log('   - checkNavigationTiming() - Verificar timing de navegación');
    console.log('   - forceInitialLoad() - Forzar carga inicial');
    console.log('   - checkPostLoginIssue() - Verificar después del login');
    console.log('   - runCompleteDiagnosis() - Ejecutar diagnóstico completo');
    
    // Ejecutar diagnóstico automático después de un delay
    setTimeout(() => {
        console.log('🔍 Ejecutando diagnóstico automático...');
        runCompleteDiagnosis();
    }, 2000);
});

console.log('✅ Script de diagnóstico de carga inicial cargado. Usa los comandos para diagnosticar el problema.'); 
