// Script para probar la eliminación de equipos
const API = require('../src/config/database');

const testEquipmentDeletion = async () => {
  try {
    console.log('🧪 Probando eliminación de equipos...');
    
    // 1. Verificar equipos existentes
    console.log('\n📋 Equipos existentes:');
    const equipment = await API.executeQuery('SELECT id, inventory_number, name FROM equipment');
    equipment.forEach((item, index) => {
      console.log(`   ${index + 1}. ID: ${item.id}, Inventario: ${item.inventory_number}, Nombre: ${item.name}`);
    });
    
    if (equipment.length === 0) {
      console.log('❌ No hay equipos para probar eliminación');
      return;
    }
    
    // 2. Seleccionar un equipo para eliminar
    const equipmentToDelete = equipment[0];
    console.log(`\n🗑️ Eliminando equipo: ${equipmentToDelete.name} (ID: ${equipmentToDelete.id})`);
    
    // 3. Eliminar el equipo
    await API.executeQuery('DELETE FROM equipment WHERE id = ?', [equipmentToDelete.id]);
    console.log('✅ Equipo eliminado de la base de datos');
    
    // 4. Verificar que fue eliminado
    console.log('\n📋 Verificando eliminación...');
    const remainingEquipment = await API.executeQuery('SELECT id, inventory_number, name FROM equipment');
    console.log(`   Equipos restantes: ${remainingEquipment.length}`);
    
    remainingEquipment.forEach((item, index) => {
      console.log(`   ${index + 1}. ID: ${item.id}, Inventario: ${item.inventory_number}, Nombre: ${item.name}`);
    });
    
    // 5. Verificar que el equipo eliminado no existe
    const deletedEquipment = await API.executeQuery('SELECT id FROM equipment WHERE id = ?', [equipmentToDelete.id]);
    if (deletedEquipment.length === 0) {
      console.log('✅ Confirmado: El equipo fue eliminado correctamente');
    } else {
      console.log('❌ Error: El equipo aún existe en la base de datos');
    }
    
    console.log('\n🎯 Prueba de eliminación completada');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testEquipmentDeletion().then(() => {
  console.log('✅ Script completado');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
}); 