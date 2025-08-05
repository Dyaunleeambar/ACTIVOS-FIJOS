/**
 * Script de auto-corrección para el problema de carga inicial de equipos
 * Detecta y corrige automáticamente el problema de que no se cargan los equipos al entrar a la página
 */

console.log('🔧 Script de auto-corrección de carga inicial cargado');

// Función para verificar si hay datos en la tabla de equipos
function checkEquipmentTableData() {
    const tableBody = document.querySelector('#equipment-table tbody');
    if (!tableBody) {
        console.log('📋 Tabla de equipos no encontrada');
        return false;
    }
    
    const rows = tableBody.querySelectorAll('tr');
    const hasData = rows.length > 0;
    
    console.log(`📊 Tabla de equipos: ${rows.length} filas encontradas`);
    return hasData;
}

// Función para verificar si estamos en la página de equipos
function isEquipmentPage() {
    return window.location.hash === '#equipment';
}

// Función para verificar si Equipment está disponible y funcionando
function isEquipmentAvailable() {
    return window.Equipment && 
           typeof window.Equipment === 'object' && 
           typeof window.Equipment.loadEquipmentList === 'function';
}

// Función para auto-corregir la carga de equipos
function autoFixEquipmentLoad() {
    console.log('🔧 Ejecutando auto-corrección de carga de equipos...');
    
    // Verificar si estamos en la página correcta
    if (!isEquipmentPage()) {
        console.log('📍 No estamos en la página de equipos');
        return;
    }
    
    // Verificar si Equipment está disponible
    if (!isEquipmentAvailable()) {
        console.log('⚠️ Equipment no está disponible, esperando...');
        setTimeout(autoFixEquipmentLoad, 1000);
        return;
    }
    
    // Verificar si hay datos en la tabla
    if (checkEquipmentTableData()) {
        console.log('✅ La tabla ya tiene datos, no es necesario corregir');
        return;
    }
    
    // Si no hay datos, cargar equipos
    console.log('📊 No hay datos en la tabla, cargando equipos...');
    window.Equipment.loadEquipmentList()
        .then(() => {
            console.log('✅ Equipos cargados exitosamente');
        })
        .catch(error => {
            console.error('❌ Error cargando equipos:', error);
        });
}

// Función para monitorear continuamente
function startMonitoring() {
    console.log('👀 Iniciando monitoreo de carga de equipos...');
    
    // Verificar cada 3 segundos
    setInterval(() => {
        if (isEquipmentPage() && isEquipmentAvailable() && !checkEquipmentTableData()) {
            console.log('⚠️ Detectado problema: página de equipos sin datos');
            autoFixEquipmentLoad();
        }
    }, 3000);
}

// Función para verificar después de navegación
function checkAfterNavigation() {
    console.log('🔍 Verificando después de navegación...');
    
    if (isEquipmentPage()) {
        console.log('📍 Navegación a página de equipos detectada');
        
        // Esperar un poco para que la página se cargue
        setTimeout(() => {
            if (isEquipmentAvailable() && !checkEquipmentTableData()) {
                console.log('⚠️ Problema detectado después de navegación');
                autoFixEquipmentLoad();
            }
        }, 1000);
    }
}

// Función para verificar después del login
function checkAfterLogin() {
    console.log('🔐 Verificando después del login...');
    
    // Verificar si el usuario está autenticado
    const isAuthenticated = window.Auth && window.Auth.isAuthenticated;
    
    if (isAuthenticated && isEquipmentPage()) {
        console.log('🔐 Usuario autenticado en página de equipos');
        
        // Esperar a que la aplicación se inicialice
        setTimeout(() => {
            if (isEquipmentAvailable() && !checkEquipmentTableData()) {
                console.log('⚠️ Problema detectado después del login');
                autoFixEquipmentLoad();
            }
        }, 2000);
    }
}

// Función para forzar la carga de equipos
function forceEquipmentLoad() {
    console.log('🔧 Forzando carga de equipos...');
    
    if (!isEquipmentPage()) {
        console.log('📍 Navegando a página de equipos...');
        window.location.hash = '#equipment';
        
        setTimeout(() => {
            forceEquipmentLoad();
        }, 500);
        return;
    }
    
    if (!isEquipmentAvailable()) {
        console.error('❌ Equipment no está disponible');
        return;
    }
    
    // Limpiar estado y cargar
    if (window.Equipment.cleanState) {
        window.Equipment.cleanState();
    }
    
    window.Equipment.loadEquipmentList()
        .then(() => {
            console.log('✅ Carga forzada completada');
        })
        .catch(error => {
            console.error('❌ Error en carga forzada:', error);
        });
}

// Función para verificar el estado actual
function checkCurrentState() {
    console.log('🔍 Verificando estado actual...');
    
    console.log('📍 Página actual:', window.location.hash);
    console.log('🔧 Equipment disponible:', isEquipmentAvailable());
    console.log('📊 Datos en tabla:', checkEquipmentTableData());
    console.log('🔐 Usuario autenticado:', window.Auth && window.Auth.isAuthenticated);
    
    if (isEquipmentPage() && isEquipmentAvailable() && !checkEquipmentTableData()) {
        console.log('🚨 PROBLEMA DETECTADO: Página de equipos sin datos');
        console.log('💡 Esto explica por qué necesitas hacer clic en "actualizar"');
        console.log('🔧 Aplicando corrección automática...');
        autoFixEquipmentLoad();
    } else {
        console.log('✅ Estado actual correcto');
    }
}

// Exportar funciones
window.autoFixEquipmentLoad = autoFixEquipmentLoad;
window.forceEquipmentLoad = forceEquipmentLoad;
window.checkCurrentState = checkCurrentState;
window.startMonitoring = startMonitoring;

// Inicializar auto-corrección
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Auto-corrección de carga inicial inicializada');
    console.log('📝 Comandos disponibles:');
    console.log('   - autoFixEquipmentLoad() - Aplicar corrección automática');
    console.log('   - forceEquipmentLoad() - Forzar carga de equipos');
    console.log('   - checkCurrentState() - Verificar estado actual');
    console.log('   - startMonitoring() - Iniciar monitoreo continuo');
    
    // Iniciar monitoreo automático
    startMonitoring();
    
    // Verificar estado después de un delay
    setTimeout(() => {
        checkCurrentState();
    }, 3000);
});

// Escuchar cambios de hash para verificar después de navegación
window.addEventListener('hashchange', () => {
    checkAfterNavigation();
});

// Verificar después del login (cuando Auth.showApp es llamado)
const originalShowApp = window.Auth?.showApp;
if (window.Auth) {
    window.Auth.showApp = function() {
        console.log('🔐 Auth.showApp llamado');
        originalShowApp.call(this);
        
        // Verificar después del login
        setTimeout(() => {
            checkAfterLogin();
        }, 1500);
    };
}

console.log('✅ Script de auto-corrección de carga inicial cargado. Se ejecutará automáticamente.'); 
