// ========================================
// TEST DE EQUIPMENT - Verificación de disponibilidad
// ========================================

const EquipmentTest = {
    // Verificar disponibilidad de Equipment
    checkEquipmentAvailability: function() {
        console.log('🔍 Verificando disponibilidad de Equipment...');
        
        if (window.Equipment) {
            console.log('✅ Equipment está disponible');
            console.log('📋 Métodos disponibles:', Object.getOwnPropertyNames(window.Equipment));
            
            // Verificar métodos específicos
            const requiredMethods = ['showCreateForm', 'viewEquipment', 'deleteEquipment', 'goToPage'];
            requiredMethods.forEach(method => {
                if (typeof window.Equipment[method] === 'function') {
                    console.log(`✅ ${method} está disponible`);
                } else {
                    console.error(`❌ ${method} NO está disponible`);
                }
            });
            
            return true;
        } else {
            console.error('❌ Equipment NO está disponible');
            return false;
        }
    },
    
    // Probar botón Nuevo Equipo
    testNewEquipmentButton: function() {
        console.log('🔍 Probando botón Nuevo Equipo...');
        
        const newEquipmentBtn = document.querySelector('button[onclick*="showCreateForm"]');
        if (newEquipmentBtn) {
            console.log('✅ Botón Nuevo Equipo encontrado');
            console.log('🖱️ Simulando clic en botón Nuevo Equipo...');
            newEquipmentBtn.click();
            
            // Verificar después de un delay
            setTimeout(() => {
                const modal = document.getElementById('dynamic-equipment-modal');
                if (modal) {
                    console.log('✅ Modal dinámico creado exitosamente');
                } else {
                    console.error('❌ Modal dinámico NO creado');
                }
            }, 1000);
        } else {
            console.error('❌ Botón Nuevo Equipo NO encontrado');
        }
    },
    
    // Ejecutar todas las pruebas
    runAllTests: function() {
        console.log('🚀 Ejecutando pruebas de Equipment...');
        
        // Esperar un poco para que Equipment se inicialice
        setTimeout(() => {
            this.checkEquipmentAvailability();
            this.testNewEquipmentButton();
            console.log('✅ Pruebas de Equipment completadas');
        }, 2000);
    }
};

// Ejecutar pruebas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco más para que todos los scripts se carguen
    setTimeout(() => {
        EquipmentTest.runAllTests();
    }, 3000);
});

// Exportar para uso global
window.EquipmentTest = EquipmentTest; 
