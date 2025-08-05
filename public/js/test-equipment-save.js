/**
 * Script de prueba para verificar el comportamiento del guardado de equipos
 * Verifica que no se redirija al Dashboard después de guardar un equipo
 */

console.log('🧪 Script de prueba de guardado de equipos cargado');

// Función para monitorear cambios en el hash
function monitorHashChanges() {
    console.log('👀 Monitoreando cambios en el hash...');
    
    let lastHash = window.location.hash;
    
    const checkHash = () => {
        const currentHash = window.location.hash;
        if (currentHash !== lastHash) {
            console.log(`🔄 Hash cambió de ${lastHash} a ${currentHash}`);
            lastHash = currentHash;
            
            if (currentHash === '#dashboard') {
                console.error('❌ DETECTADO: Redirección no deseada al Dashboard');
                console.log('🔍 Posibles causas:');
                console.log('   - Error 401 durante el guardado');
                console.log('   - Logout automático ejecutado');
                console.log('   - Recarga de página');
                console.log('   - Llamada a Auth.handleLogout()');
            }
        }
    };
    
    // Verificar cada segundo
    setInterval(checkHash, 1000);
}

// Función para monitorear llamadas a Auth.handleLogout
function monitorLogoutCalls() {
    console.log('🔍 Monitoreando llamadas a Auth.handleLogout...');
    
    // Guardar referencia original
    const originalHandleLogout = window.Auth?.handleLogout;
    
    if (window.Auth && originalHandleLogout) {
        // Sobrescribir temporalmente para monitorear
        window.Auth.handleLogout = function(...args) {
            console.error('🚨 DETECTADO: Llamada a Auth.handleLogout()');
            console.log('📍 Stack trace:', new Error().stack);
            console.log('🔍 Argumentos:', args);
            
            // Llamar a la función original
            return originalHandleLogout.apply(this, args);
        };
        
        console.log('✅ Monitoreo de Auth.handleLogout activado');
    } else {
        console.warn('⚠️ Auth.handleLogout no disponible para monitoreo');
    }
}

// Función para monitorear llamadas a Auth.showApp
function monitorShowAppCalls() {
    console.log('🔍 Monitoreando llamadas a Auth.showApp...');
    
    // Guardar referencia original
    const originalShowApp = window.Auth?.showApp;
    
    if (window.Auth && originalShowApp) {
        // Sobrescribir temporalmente para monitorear
        window.Auth.showApp = function(...args) {
            console.error('🚨 DETECTADO: Llamada a Auth.showApp()');
            console.log('📍 Stack trace:', new Error().stack);
            console.log('🔍 Argumentos:', args);
            console.log('📍 Hash actual:', window.location.hash);
            
            // Llamar a la función original
            return originalShowApp.apply(this, args);
        };
        
        console.log('✅ Monitoreo de Auth.showApp activado');
    } else {
        console.warn('⚠️ Auth.showApp no disponible para monitoreo');
    }
}

// Función para verificar el comportamiento después del guardado
function verifyPostSaveBehavior() {
    console.log('🔍 Verificando comportamiento después del guardado...');
    
    const currentHash = window.location.hash;
    console.log('📍 Hash después del guardado:', currentHash);
    
    if (currentHash === '#equipment') {
        console.log('✅ Comportamiento correcto: Permanece en la página de equipos');
    } else if (currentHash === '#dashboard') {
        console.error('❌ Comportamiento incorrecto: Redirigió al Dashboard');
    } else {
        console.warn('⚠️ Hash inesperado:', currentHash);
    }
}

// Función para simular el guardado de un equipo (solo para pruebas manuales)
async function testEquipmentSave() {
    console.log('🔍 Simulando guardado de equipo...');
    
    // Verificar que estamos en la página de equipos
    const currentHash = window.location.hash;
    console.log('📍 Hash actual:', currentHash);
    
    if (currentHash !== '#equipment') {
        console.log('⚠️ No estamos en la página de equipos, navegando...');
        window.location.hash = '#equipment';
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Verificar que el modal se puede abrir
    if (window.Equipment && window.Equipment.showCreateForm) {
        console.log('✅ Equipment.showCreateForm disponible');
        
        // Abrir modal de nuevo equipo
        window.Equipment.showCreateForm();
        
        console.log('💡 Modal abierto. Para probar el guardado:');
        console.log('   1. Llena el formulario manualmente');
        console.log('   2. Haz clic en "Guardar Equipo"');
        console.log('   3. Verifica que permanece en la página de equipos');
        
    } else {
        console.error('❌ Equipment.showCreateForm no disponible');
    }
}

// Inicializar monitoreo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Script de prueba de guardado de equipos cargado');
    console.log('📝 Para ejecutar la prueba manualmente, usa: testEquipmentSave()');
    console.log('📝 Para verificar comportamiento después del guardado, usa: verifyPostSaveBehavior()');
    console.log('📝 Para monitorear cambios en el hash, usa: monitorHashChanges()');
    
    // Solo monitorear cambios en el hash - NO ejecutar automáticamente
    monitorHashChanges();
    
    // Monitorear llamadas a Auth.handleLogout
    setTimeout(() => {
        monitorLogoutCalls();
        monitorShowAppCalls();
    }, 1000);
});

// Exportar funciones para uso manual
window.testEquipmentSave = testEquipmentSave;
window.verifyPostSaveBehavior = verifyPostSaveBehavior;
window.monitorHashChanges = monitorHashChanges;
window.monitorLogoutCalls = monitorLogoutCalls;
window.monitorShowAppCalls = monitorShowAppCalls;

console.log('✅ Script de prueba cargado. Usa testEquipmentSave() para ejecutar la prueba manualmente.'); 
