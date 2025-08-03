// Script de prueba para verificar el guardado de equipos
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testEquipmentSave = async () => {
  try {
    console.log('🧪 PROBANDO GUARDADO DE EQUIPOS');
    console.log('================================');

    // 1. Verificar que el servidor esté corriendo
    console.log('🔍 1. Verificando servidor...');
    const healthResponse = await fetch('http://localhost:3001/health');
    console.log('✅ Servidor status:', healthResponse.status);

    // 2. Simular login para obtener token
    console.log('🔍 2. Simulando login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123' // Asumiendo que esta es la contraseña
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Error en login:', loginResponse.status);
      const errorData = await loginResponse.json();
      console.log('📋 Error details:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login exitoso, token obtenido');

    // 3. Probar obtener equipos
    console.log('🔍 3. Probando obtener equipos...');
    const equipmentResponse = await fetch('http://localhost:3001/api/equipment', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (equipmentResponse.ok) {
      const equipmentData = await equipmentResponse.json();
      console.log('✅ Equipos obtenidos:', equipmentData.equipment?.length || 0, 'equipos');
    } else {
      console.log('❌ Error obteniendo equipos:', equipmentResponse.status);
      const errorData = await equipmentResponse.json();
      console.log('📋 Error details:', errorData);
    }

    // 4. Probar crear un equipo
    console.log('🔍 4. Probando crear equipo...');
    const testEquipment = {
      inventory_number: 'TEST-' + Date.now(),
      name: 'Equipo de Prueba',
      type: 'desktop',
      brand: 'Test Brand',
      model: 'Test Model',
      specifications: 'Especificaciones de prueba',
      status: 'active',
      state_id: 1
      // Removido assigned_to para evitar problemas de validación
    };

    const createResponse = await fetch('http://localhost:3001/api/equipment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testEquipment)
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Equipo creado exitosamente');
      console.log('📋 Datos del equipo creado:', createData);
      
      // 5. Probar actualizar el equipo
      console.log('🔍 5. Probando actualizar equipo...');
      const updateData = {
        name: 'Equipo de Prueba Actualizado',
        specifications: 'Especificaciones actualizadas'
      };

      const updateResponse = await fetch(`http://localhost:3001/api/equipment/${createData.equipment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        console.log('✅ Equipo actualizado exitosamente');
        console.log('📋 Datos del equipo actualizado:', updateResult);
      } else {
        console.log('❌ Error actualizando equipo:', updateResponse.status);
        const errorData = await updateResponse.json();
        console.log('📋 Error details:', errorData);
      }

      // 6. Probar eliminar el equipo
      console.log('🔍 6. Probando eliminar equipo...');
      const deleteResponse = await fetch(`http://localhost:3001/api/equipment/${createData.equipment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (deleteResponse.ok) {
        console.log('✅ Equipo eliminado exitosamente');
      } else {
        console.log('❌ Error eliminando equipo:', deleteResponse.status);
        const errorData = await deleteResponse.json();
        console.log('📋 Error details:', errorData);
      }

    } else {
      console.log('❌ Error creando equipo:', createResponse.status);
      const errorData = await createResponse.json();
      console.log('📋 Error details:', errorData);
    }

    console.log('🎉 PRUEBA COMPLETADA');

  } catch (error) {
    console.error('💥 Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testEquipmentSave(); 