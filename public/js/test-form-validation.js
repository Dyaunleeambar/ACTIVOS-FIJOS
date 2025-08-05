/**
 * Script para probar la validación del formulario de equipos
 */

console.log('🧪 Script de prueba de validación de formulario cargado');

// Función para probar validación de campos obligatorios
function testRequiredFields() {
    console.log('🔍 Probando validación de campos obligatorios...');
    
    // Simular formulario con campos faltantes
    const formData = {
        inventory_number: 'TEST-001',
        name: 'Equipo de Prueba',
        type: 'desktop',
        // brand: 'Faltante', // Campo obligatorio faltante
        // model: 'Faltante', // Campo obligatorio faltante
        status: 'active',
        state_id: '1',
        assigned_to: 'Usuario de Prueba'
        // location_details: 'Opcional' // Campo opcional
    };
    
    console.log('📝 Datos del formulario:', formData);
    
    // Verificar campos obligatorios
    const requiredFields = {
        inventory_number: 'Número de inventario',
        name: 'Nombre del equipo',
        type: 'Tipo',
        brand: 'Marca',
        model: 'Modelo',
        status: 'Estado',
        state_id: 'Estado/Región',
        assigned_to: 'Responsable del equipo'
    };
    
    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field] || formData[field].trim() === '') {
            missingFields.push(label);
        }
    }
    
    if (missingFields.length > 0) {
        console.log('❌ Campos obligatorios faltantes:', missingFields);
        console.log('💡 Agrega los campos faltantes para que el formulario sea válido');
    } else {
        console.log('✅ Todos los campos obligatorios están presentes');
    }
    
    return missingFields;
}

// Función para probar validación con todos los campos
function testCompleteForm() {
    console.log('🔍 Probando formulario completo...');
    
    const formData = {
        inventory_number: 'TEST-002',
        name: 'Equipo Completo',
        type: 'laptop',
        brand: 'Dell',
        model: 'Latitude 5520',
        specifications: 'Intel i7, 16GB RAM, 512GB SSD',
        status: 'active',
        state_id: '2',
        assigned_to: 'Usuario Completo',
        location_details: 'Oficina principal, piso 3' // Campo opcional
    };
    
    console.log('📝 Datos del formulario completo:', formData);
    
    // Verificar campos obligatorios
    const requiredFields = {
        inventory_number: 'Número de inventario',
        name: 'Nombre del equipo',
        type: 'Tipo',
        brand: 'Marca',
        model: 'Modelo',
        status: 'Estado',
        state_id: 'Estado/Región',
        assigned_to: 'Responsable del equipo'
    };
    
    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field] || formData[field].trim() === '') {
            missingFields.push(label);
        }
    }
    
    if (missingFields.length > 0) {
        console.log('❌ Campos obligatorios faltantes:', missingFields);
    } else {
        console.log('✅ Formulario completo y válido');
        console.log('💡 Este formulario debería enviarse correctamente');
    }
    
    return missingFields;
}

// Función para simular envío de formulario
function simulateFormSubmission(formData) {
    console.log('📤 Simulando envío de formulario...');
    console.log('📝 Datos a enviar:', formData);
    
    // Simular validación del frontend
    const requiredFields = {
        inventory_number: 'Número de inventario',
        name: 'Nombre del equipo',
        type: 'Tipo',
        brand: 'Marca',
        model: 'Modelo',
        status: 'Estado',
        state_id: 'Estado/Región',
        assigned_to: 'Responsable del equipo'
    };
    
    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field] || formData[field].trim() === '') {
            missingFields.push(label);
        }
    }
    
    if (missingFields.length > 0) {
        console.log('❌ Validación fallida - Campos faltantes:', missingFields);
        console.log('💡 El formulario no se enviará hasta que se completen todos los campos obligatorios');
        return false;
    } else {
        console.log('✅ Validación exitosa - Formulario listo para enviar');
        console.log('💡 El formulario se enviaría al servidor');
        return true;
    }
}

// Función para probar diferentes escenarios
function testValidationScenarios() {
    console.log('🧪 Probando diferentes escenarios de validación...');
    
    // Escenario 1: Formulario incompleto (marca y modelo faltantes)
    console.log('\n=== ESCENARIO 1: Formulario incompleto ===');
    const incompleteForm = {
        inventory_number: 'TEST-003',
        name: 'Equipo Incompleto',
        type: 'desktop',
        // brand: 'Faltante',
        // model: 'Faltante',
        status: 'active',
        state_id: '1',
        assigned_to: 'Usuario Test'
    };
    simulateFormSubmission(incompleteForm);
    
    // Escenario 2: Formulario completo
    console.log('\n=== ESCENARIO 2: Formulario completo ===');
    const completeForm = {
        inventory_number: 'TEST-004',
        name: 'Equipo Completo',
        type: 'laptop',
        brand: 'HP',
        model: 'ProBook 450',
        specifications: 'Intel i5, 8GB RAM',
        status: 'active',
        state_id: '2',
        assigned_to: 'Usuario Completo',
        location_details: 'Oficina secundaria' // Opcional
    };
    simulateFormSubmission(completeForm);
    
    // Escenario 3: Campos vacíos
    console.log('\n=== ESCENARIO 3: Campos vacíos ===');
    const emptyFieldsForm = {
        inventory_number: 'TEST-005',
        name: 'Equipo con campos vacíos',
        type: 'printer',
        brand: '', // Campo vacío
        model: '', // Campo vacío
        status: 'active',
        state_id: '1',
        assigned_to: 'Usuario Test'
    };
    simulateFormSubmission(emptyFieldsForm);
}

// Función para verificar el formulario actual
function checkCurrentForm() {
    console.log('🔍 Verificando formulario actual...');
    
    const form = document.getElementById('dynamic-equipment-form');
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    console.log('✅ Formulario encontrado');
    
    // Verificar campos obligatorios en el DOM
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    console.log('📝 Campos obligatorios en el DOM:', requiredInputs.length);
    
    requiredInputs.forEach(input => {
        console.log(`   - ${input.name}: ${input.value || 'Vacío'}`);
    });
    
    // Verificar campos opcionales
    const optionalInputs = form.querySelectorAll('input:not([required]), select:not([required]), textarea:not([required])');
    console.log('📝 Campos opcionales en el DOM:', optionalInputs.length);
    
    optionalInputs.forEach(input => {
        if (input.name) {
            console.log(`   - ${input.name}: ${input.value || 'Vacío'}`);
        }
    });
}

// Exportar funciones
window.testRequiredFields = testRequiredFields;
window.testCompleteForm = testCompleteForm;
window.simulateFormSubmission = simulateFormSubmission;
window.testValidationScenarios = testValidationScenarios;
window.checkCurrentForm = checkCurrentForm;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧪 Script de prueba de validación inicializado');
    console.log('📝 Comandos disponibles:');
    console.log('   - testRequiredFields() - Probar campos obligatorios');
    console.log('   - testCompleteForm() - Probar formulario completo');
    console.log('   - simulateFormSubmission(data) - Simular envío');
    console.log('   - testValidationScenarios() - Probar diferentes escenarios');
    console.log('   - checkCurrentForm() - Verificar formulario actual');
    
    // Ejecutar prueba automática después de un delay
    setTimeout(() => {
        console.log('🔍 Ejecutando prueba automática...');
        testValidationScenarios();
    }, 2000);
});

console.log('✅ Script de prueba de validación cargado. Usa los comandos para probar la validación.'); 
