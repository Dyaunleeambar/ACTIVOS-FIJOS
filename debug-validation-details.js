// Script de diagnóstico específico para validación de equipos
console.log('🔍 Diagnóstico de Validación - Detalles Específicos');

// Función para probar cada campo individualmente
async function testFieldValidation(fieldName, value, expectedType) {
    console.log(`\n🧪 Probando campo: ${fieldName}`);
    console.log(`   Valor: ${value} (tipo: ${typeof value})`);
    console.log(`   Esperado: ${expectedType}`);
    
    try {
        const response = await fetch('/api/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                inventory_number: 'TEST-001',
                name: 'Test Equipment',
                type: 'laptop',
                state_id: 1,
                [fieldName]: value
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log(`   ✅ Campo ${fieldName} PASÓ la validación`);
        } else {
            console.log(`   ❌ Campo ${fieldName} FALLÓ la validación`);
            console.log(`   Error:`, result);
        }
    } catch (error) {
        console.log(`   ❌ Error en prueba:`, error);
    }
}

// Función para probar con los datos exactos del formulario
async function testExactFormData() {
    console.log('\n🎯 Probando con datos exactos del formulario...');
    
    // Simular los datos que se envían desde el formulario
    const formData = {
        inventory_number: '8-01-24-01-006',
        name: 'LAPTOP-INFO',
        type: 'laptop',
        brand: 'Asus',
        model: 'P1440FAC',
        specifications: 'Intel Core i5, 8GB RAM, 256GB SSD',
        status: 'active',
        state_id: 1,
        assigned_to: null
    };
    
    console.log('📋 Datos que se envían:', formData);
    
    try {
        const response = await fetch('/api/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Formulario PASÓ la validación');
            console.log('Resultado:', result);
        } else {
            console.log('❌ Formulario FALLÓ la validación');
            console.log('Error completo:', result);
            
            if (result.details && result.details.length > 0) {
                console.log('\n📝 Detalles de errores de validación:');
                result.details.forEach((error, index) => {
                    console.log(`   ${index + 1}. Campo: ${error.path}`);
                    console.log(`      Valor: ${error.value}`);
                    console.log(`      Mensaje: ${error.msg}`);
                    console.log(`      Tipo: ${error.type}`);
                });
            }
        }
    } catch (error) {
        console.log('❌ Error en prueba:', error);
    }
}

// Función para verificar el token de autenticación
function checkAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('❌ No hay token de autenticación');
        return false;
    }
    
    console.log('✅ Token encontrado');
    console.log('Token:', token.substring(0, 20) + '...');
    return true;
}

// Función para verificar el estado del servidor
async function checkServerStatus() {
    try {
        const response = await fetch('/api/health');
        if (response.ok) {
            console.log('✅ Servidor está funcionando');
        } else {
            console.log('❌ Servidor no responde correctamente');
        }
    } catch (error) {
        console.log('❌ No se puede conectar al servidor:', error);
    }
}

// Ejecutar diagnóstico completo
async function runFullDiagnostic() {
    console.log('🚀 Iniciando diagnóstico completo de validación...\n');
    
    // 1. Verificar autenticación
    console.log('1️⃣ Verificando autenticación...');
    if (!checkAuthToken()) {
        console.log('❌ No se puede continuar sin token de autenticación');
        return;
    }
    
    // 2. Verificar estado del servidor
    console.log('\n2️⃣ Verificando estado del servidor...');
    await checkServerStatus();
    
    // 3. Probar campos individuales
    console.log('\n3️⃣ Probando validación de campos individuales...');
    await testFieldValidation('brand', 'Asus', 'string');
    await testFieldValidation('model', 'P1440FAC', 'string');
    await testFieldValidation('specifications', 'Intel Core i5, 8GB RAM', 'string');
    await testFieldValidation('status', 'active', 'string');
    await testFieldValidation('state_id', 1, 'number');
    await testFieldValidation('assigned_to', null, 'number or null');
    
    // 4. Probar con datos exactos del formulario
    console.log('\n4️⃣ Probando con datos exactos del formulario...');
    await testExactFormData();
    
    console.log('\n🏁 Diagnóstico completo finalizado');
}

// Ejecutar cuando se cargue la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFullDiagnostic);
} else {
    runFullDiagnostic();
}

// También exponer funciones para uso manual
window.debugValidation = {
    testFieldValidation,
    testExactFormData,
    checkAuthToken,
    checkServerStatus,
    runFullDiagnostic
}; 
