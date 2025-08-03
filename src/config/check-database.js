const { executeQuery } = require('./database');

const checkDatabase = async () => {
  try {
    console.log('🔍 Verificando estado de la base de datos...');

    // Verificar equipos existentes
    const equipment = await executeQuery('SELECT id, inventory_number, name, assigned_to FROM equipment ORDER BY id');
    
    console.log('📊 Equipos en la base de datos:');
    console.log(`   Total: ${equipment.length} equipos`);
    
    if (equipment.length > 0) {
      equipment.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}, Inventario: ${item.inventory_number}, Nombre: ${item.name}, Asignado: ${item.assigned_to || 'Sin asignar'}`);
      });
    } else {
      console.log('   No hay equipos en la base de datos');
    }

    // Verificar usuarios
    const users = await executeQuery('SELECT id, username, full_name, role FROM users ORDER BY id');
    console.log(`\n👥 Usuarios en la base de datos: ${users.length}`);

    // Verificar estados
    const states = await executeQuery('SELECT id, name, code FROM states ORDER BY id');
    console.log(`\n🏛️ Estados en la base de datos: ${states.length}`);

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
    throw error;
  }
};

module.exports = { checkDatabase }; 
