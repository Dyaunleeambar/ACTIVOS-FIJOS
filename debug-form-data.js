// Script para capturar datos exactos del formulario real
console.log('🔍 Debug: Capturando datos del formulario real');

// Interceptar el envío del formulario para capturar datos
function interceptFormSubmission() {
    // Buscar el formulario de equipos
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        if (form.querySelector('input[name="inventory_number"]')) {
            console.log('📋 Formulario de equipos encontrado');
            
            // Interceptar el evento submit
            form.addEventListener('submit', function(e) {
                console.log('🚀 Formulario enviado - capturando datos...');
                
                const formData = new FormData(form);
                const data = {};
                
                // Capturar todos los campos del formulario
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                    console.log(`   ${key}: ${value} (tipo: ${typeof value})`);
                }
                
                console.log('📊 Datos completos del formulario:', data);
                
                // Verificar tipos de datos
                console.log('🔍 Análisis de tipos:');
                Object.entries(data).forEach(([key, value]) => {
                    console.log(`   ${key}: ${value} (${typeof value})`);
                    
                    // Verificar si es un número
                    if (key === 'state_id' || key === 'assigned_to') {
                        const numValue = parseInt(value);
                        console.log(`   ${key} como número: ${numValue} (isNaN: ${isNaN(numValue)})`);
                    }
                });
                
                // No prevenir el envío, solo capturar
                console.log('✅ Datos capturados, continuando con el envío...');
            });
        }
    });
}

// Función para simular el envío del formulario real
function simulateRealFormSubmission() {
    console.log('🧪 Simulando envío del formulario real...');
    
    // Buscar el formulario
    const form = document.querySelector('form');
    if (!form) {
        console.log('❌ No se encontró formulario');
        return;
    }
    
    // Llenar el formulario con datos de prueba
    const testData = {
        'inventory_number': 'TEST-REAL-001',
        'name': 'Equipo de Prueba Real',
        'type': 'laptop',
        'brand': 'Dell',
        'model': 'Latitude 5520',
        'specifications': 'Intel Core i5, 8GB RAM',
        'status': 'active',
        'state_id': '1',
        'assigned_to': '' // Campo vacío para probar
    };
    
    // Llenar los campos
    Object.entries(testData).forEach(([name, value]) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) {
            field.value = value;
            console.log(`   Llenado ${name}: ${value}`);
        } else {
            console.log(`   ❌ Campo ${name} no encontrado`);
        }
    });
    
    console.log('📋 Formulario llenado, simulando envío...');
    
    // Simular el envío
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
}

// Función para verificar el estado del servidor
async function checkServerStatus() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('🏥 Estado del servidor:', data);
        return response.ok;
    } catch (error) {
        console.log('❌ Error conectando al servidor:', error);
        return false;
    }
}

// Función para probar la API directamente
async function testAPIDirectly() {
    console.log('🧪 Probando API directamente...');
    
    const testData = {
        inventory_number: 'TEST-API-001',
        name: 'Equipo API Test',
        type: 'laptop',
        brand: 'HP',
        model: 'ProBook 450',
        specifications: 'Intel Core i7, 16GB RAM',
        status: 'active',
        state_id: 1,
        assigned_to: null
    };
    
    console.log('📋 Datos de prueba:', testData);
    
    try {
        const response = await fetch('/api/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        
        console.log('📡 Respuesta del servidor:');
        console.log('   Status:', response.status);
        console.log('   Response:', result);
        
        if (response.ok) {
            console.log('✅ API funciona correctamente');
        } else {
            console.log('❌ API falló:', result);
        }
    } catch (error) {
        console.log('❌ Error en prueba API:', error);
    }
}

// Ejecutar cuando se cargue la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Debug de formulario iniciado');
        interceptFormSubmission();
        
        // Esperar un poco y verificar servidor
        setTimeout(async () => {
            await checkServerStatus();
            await testAPIDirectly();
        }, 1000);
    });
} else {
    console.log('🚀 Debug de formulario iniciado (página ya cargada)');
    interceptFormSubmission();
    
    // Verificar servidor inmediatamente
    checkServerStatus().then(() => {
        testAPIDirectly();
    });
}

// Exponer funciones para uso manual
window.debugForm = {
    interceptFormSubmission,
    simulateRealFormSubmission,
    checkServerStatus,
    testAPIDirectly
}; 
