// Script para probar el formulario de equipos en el navegador
console.log('🧪 PROBANDO FORMULARIO DE EQUIPOS');
console.log('==================================');

// Función para simular el envío de datos del formulario
const testEquipmentForm = async () => {
    try {
        // Simular datos del formulario
        const formData = {
            inventory_number: 'INV-TEST-' + Date.now(),
            name: 'Laptop de Prueba',
            type: 'laptop',
            brand: 'Dell',
            model: 'Latitude 5520',
            specifications: 'Intel i5, 8GB RAM, 256GB SSD',
            status: 'active',
            state_id: 1,
            assigned_to: null
        };

        console.log('📋 Datos de prueba:', formData);

        // Verificar token de autenticación
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('❌ No hay token de autenticación');
            return;
        }

        console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');

        // Hacer la petición a la API
        const response = await fetch('http://localhost:3001/api/equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        console.log('📡 Respuesta del servidor:');
        console.log('Status:', response.status);
        console.log('Response:', result);

        if (response.ok) {
            console.log('✅ Equipo creado exitosamente');
        } else {
            console.log('❌ Error al crear equipo:');
            console.log('Error:', result.error);
            if (result.details) {
                console.log('Detalles:', result.details);
            }
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
};

// Función para verificar el estado del servidor
const checkServerStatus = async () => {
    try {
        const response = await fetch('http://localhost:3001/health');
        const result = await response.json();
        console.log('🏥 Estado del servidor:', result);
        return response.ok;
    } catch (error) {
        console.error('❌ Servidor no disponible:', error);
        return false;
    }
};

// Función para verificar autenticación
const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    console.log('🔐 Estado de autenticación:');
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('User data:', userData ? 'Presente' : 'Ausente');
    
    return !!token;
};

// Función principal
const runTest = async () => {
    console.log('🚀 Iniciando pruebas...');
    
    // 1. Verificar servidor
    const serverOk = await checkServerStatus();
    if (!serverOk) {
        console.log('❌ Servidor no disponible, abortando pruebas');
        return;
    }
    
    // 2. Verificar autenticación
    const authOk = checkAuth();
    if (!authOk) {
        console.log('❌ No hay autenticación, abortando pruebas');
        return;
    }
    
    // 3. Probar formulario
    await testEquipmentForm();
};

// Ejecutar pruebas si estamos en el navegador
if (typeof window !== 'undefined') {
    // Esperar un momento para que la página cargue
    setTimeout(runTest, 1000);
} else {
    console.log('Este script debe ejecutarse en el navegador');
} 