// Script para diagnosticar el formulario de equipos
console.log('🔍 DIAGNÓSTICO DEL FORMULARIO DE EQUIPOS');
console.log('==========================================');

// Función para simular el envío de datos
const simulateEquipmentForm = () => {
    // Simular datos del formulario
    const formData = {
        inventory_number: 'INV-TEST-001',
        name: 'Laptop de Prueba',
        type: 'laptop',
        brand: 'Dell',
        model: 'Latitude 5520',
        specifications: 'Intel i5, 8GB RAM, 256GB SSD',
        status: 'active',
        state_id: '1',
        assigned_to: null
    };

    console.log('📋 Datos que se enviarían:');
    console.log(JSON.stringify(formData, null, 2));

    // Verificar validaciones del backend
    console.log('\n🔍 Verificando validaciones del backend:');
    
    // Validaciones requeridas según validateCreateEquipment
    const validations = [
        { field: 'inventory_number', required: true, value: formData.inventory_number, valid: !!formData.inventory_number },
        { field: 'name', required: true, value: formData.name, valid: !!formData.name },
        { field: 'type', required: true, value: formData.type, valid: ['desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'radio_communication', 'sim_chip', 'roaming', 'other'].includes(formData.type) },
        { field: 'state_id', required: true, value: formData.state_id, valid: !isNaN(parseInt(formData.state_id)) },
        { field: 'status', required: false, value: formData.status, valid: ['active', 'maintenance', 'out_of_service', 'disposed'].includes(formData.status) }
    ];

    validations.forEach(validation => {
        const status = validation.valid ? '✅' : '❌';
        console.log(`${status} ${validation.field}: ${validation.value} (${validation.required ? 'requerido' : 'opcional'})`);
    });

    // Verificar si hay errores
    const errors = validations.filter(v => !v.valid);
    if (errors.length > 0) {
        console.log('\n❌ Errores encontrados:');
        errors.forEach(error => {
            console.log(`- ${error.field}: valor inválido "${error.value}"`);
        });
    } else {
        console.log('\n✅ Todos los datos son válidos');
    }

    return formData;
};

// Función para probar la API
const testAPI = async (data) => {
    try {
        console.log('\n🧪 Probando API con datos válidos...');
        
        const response = await fetch('http://localhost:3001/api/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        console.log('📡 Respuesta del servidor:');
        console.log('Status:', response.status);
        console.log('Response:', result);

        if (response.ok) {
            console.log('✅ API funcionando correctamente');
        } else {
            console.log('❌ Error en la API:', result.error);
            if (result.details) {
                console.log('Detalles del error:', result.details);
            }
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
};

// Ejecutar diagnóstico
const runDiagnostic = async () => {
    const formData = simulateEquipmentForm();
    await testAPI(formData);
};

// Ejecutar si estamos en el navegador
if (typeof window !== 'undefined') {
    runDiagnostic();
} else {
    console.log('Este script debe ejecutarse en el navegador');
} 