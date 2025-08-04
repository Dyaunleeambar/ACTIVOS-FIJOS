// Script para probar la eliminación de equipos
const API = require('../src/config/database-sqlite');

const testDeleteEquipment = async () => {
  try {
    console.log('🧪 Probando eliminación de equipos...');
    
    // 1. Verificar equipos existentes
    console.log('\n📋 Equipos existentes:');
    const equipment = await API.executeQuery('SELECT id, inventory_number, name, assigned_to FROM equipment');
    equipment.forEach((item, index) => {
      console.log(`   ${index + 1}. ID: ${item.id}, Inventario: ${item.inventory_number}, Nombre: ${item.name}, Asignado: ${item.assigned_to || 'No asignado'}`);
    });
    
    if (equipment.length === 0) {
      console.log('❌ No hay equipos para probar eliminación');
      return;
    }
    
    // 2. Seleccionar un equipo para eliminar (preferiblemente uno no asignado)
    let equipmentToDelete = equipment[0];
    
    // Buscar un equipo no asignado
    const unassignedEquipment = equipment.find(item => !item.assigned_to || item.assigned_to.trim() === '');
    if (unassignedEquipment) {
      equipmentToDelete = unassignedEquipment;
      console.log(`\n✅ Seleccionando equipo no asignado: ${equipmentToDelete.name} (ID: ${equipmentToDelete.id})`);
    } else {
      console.log(`\n⚠️ No hay equipos sin asignar, usando el primero: ${equipmentToDelete.name} (ID: ${equipmentToDelete.id})`);
    }
    
    // 3. Verificar que el equipo existe antes de eliminar
    console.log('\n🔍 Verificando que el equipo existe...');
    const existingEquipment = await API.executeQuery('SELECT id, inventory_number, name, assigned_to FROM equipment WHERE id = ?', [equipmentToDelete.id]);
    
    if (existingEquipment.length === 0) {
      console.log('❌ El equipo no existe en la base de datos');
      return;
    }
    
    console.log('✅ Equipo encontrado:', existingEquipment[0]);
    
    // 4. Intentar eliminar el equipo
    console.log('\n🗑️ Intentando eliminar equipo...');
    const deleteResult = await API.executeUpdate('DELETE FROM equipment WHERE id = ?', [equipmentToDelete.id]);
    
    console.log('📊 Resultado de eliminación:', deleteResult);
    
    if (deleteResult.changes > 0) {
      console.log('✅ Equipo eliminado exitosamente');
      
      // 5. Verificar que el equipo fue eliminado
      console.log('\n🔍 Verificando que el equipo fue eliminado...');
      const remainingEquipment = await API.executeQuery('SELECT id, inventory_number, name FROM equipment WHERE id = ?', [equipmentToDelete.id]);
      
      if (remainingEquipment.length === 0) {
        console.log('✅ Confirmado: El equipo ya no existe en la base de datos');
      } else {
        console.log('❌ Error: El equipo aún existe después de la eliminación');
      }
      
      // 6. Mostrar equipos restantes
      console.log('\n📋 Equipos restantes:');
      const remainingEquipmentList = await API.executeQuery('SELECT id, inventory_number, name FROM equipment');
      remainingEquipmentList.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}, Inventario: ${item.inventory_number}, Nombre: ${item.name}`);
      });
      
    } else {
      console.log('❌ No se pudo eliminar el equipo');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba de eliminación:', error);
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  testDeleteEquipment().then(() => {
    console.log('\n🎯 Prueba completada');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { testDeleteEquipment }; 
