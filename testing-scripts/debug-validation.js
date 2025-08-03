// Script para diagnosticar el problema de validación
console.log('🔍 DIAGNÓSTICO DE VALIDACIÓN');
console.log('==============================');

// Función para probar diferentes tipos de datos
const testValidation = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.log('❌ No hay token de autenticación');
        return;
    }

    // Casos de prueba
    const testCases = [
        {
            name: 'Caso 1: Datos completos válidos',
            data: {
                inventory_number: 'INV-TEST-001',
                name: 'Laptop de Prueba',
                type: 'laptop',
                brand: 'Dell',
                model: 'Latitude 5520',
                specifications: 'Intel i5, 8GB RAM, 256GB SSD',
                status: 'active',
                state_id: 1,
                assigned_to: null
            }
        },
        {
            name: 'Caso 2: state_id como string',
            data: {
                inventory_number: 'INV-TEST-002',
                name: 'Desktop de Prueba',
                type: 'desktop',
                brand: 'HP',
                model: 'ProDesk 600',
                specifications: 'Intel i3, 4GB RAM, 500GB HDD',
                status: 'active',
                state_id: '1', // String en lugar de número
                assigned_to: null
            }
        },
        {
            name: 'Caso 3: Datos mínimos',
            data: {
                inventory_number: 'INV-TEST-003',
                name: 'Equipo Mínimo',
                type: 'other',
                status: 'active',
                state_id: 1
            }
        },
        {
            name: 'Caso 4: Con assigned_to',
            data: {
                inventory_number: 'INV-TEST-004',
                name: 'Equipo Asignado',
                type: 'laptop',
                brand: 'Lenovo',
                model: 'ThinkPad T14',
                specifications: 'AMD Ryzen 5, 16GB RAM, 512GB SSD',
                status: 'active',
                state_id: 1,
                assigned_to: 1
            }
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n🧪 ${testCase.name}`);
        console.log('📋 Datos:', testCase.data);
        
        try {
            const response = await fetch('http://localhost:3001/api/equipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testCase.data)
            });

            const result = await response.json();
            
            console.log('📡 Respuesta:');
            console.log('Status:', response.status);
            console.log('Response:', result);
            
            if (response.ok) {
                console.log('✅ ÉXITO');
            } else {
                console.log('❌ ERROR');
                if (result.details) {
                    console.log('Detalles del error:');
                    result.details.forEach(detail => {
                        console.log(`- ${detail.path}: ${detail.msg}`);
                    });
                }
            }
            
        } catch (error) {
            console.error('❌ Error de conexión:', error);
        }
        
        // Esperar un momento entre pruebas
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

// Función para verificar la estructura del formulario
const checkFormStructure = () => {
    console.log('\n🔍 Verificando estructura del formulario...');
    
    // Buscar el formulario dinámico
    const forms = document.querySelectorAll('form');
    console.log('Formularios encontrados:', forms.length);
    
    forms.forEach((form, index) => {
        console.log(`\nFormulario ${index + 1}:`);
        console.log('ID:', form.id);
        console.log('Action:', form.action);
        console.log('Method:', form.method);
        
        const inputs = form.querySelectorAll('input, select, textarea');
        console.log('Campos encontrados:', inputs.length);
        
        inputs.forEach(input => {
            console.log(`- ${input.name}: ${input.type} (${input.value})`);
        });
    });
};

// Función para verificar los datos que se envían
const checkFormData = () => {
    console.log('\n🔍 Verificando datos del formulario...');
    
    // Buscar el formulario de equipos
    const form = document.querySelector('form');
    if (!form) {
        console.log('❌ No se encontró ningún formulario');
        return;
    }
    
    const formData = new FormData(form);
    console.log('📋 Datos del formulario:');
    
    for (const [key, value] of formData.entries()) {
        console.log(`- ${key}: ${value} (tipo: ${typeof value})`);
    }
};

// Función principal
const runDiagnostic = async () => {
    console.log('🚀 Iniciando diagnóstico de validación...');
    
    // 1. Verificar estructura del formulario
    checkFormStructure();
    
    // 2. Verificar datos del formulario
    checkFormData();
    
    // 3. Probar validaciones
    await testValidation();
};

// Ejecutar si estamos en el navegador
if (typeof window !== 'undefined') {
    // Esperar a que la página cargue completamente
    setTimeout(runDiagnostic, 2000);
} else {
    console.log('Este script debe ejecutarse en el navegador');
} 
