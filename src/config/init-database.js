const { executeQuery } = require('./database');

const initializeDatabase = async () => {
  try {
    console.log('🔧 Inicializando base de datos...');

    // Crear tabla de estados si no existe
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS states (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(10) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de usuarios si no existe
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        role ENUM('admin', 'manager', 'consultant') DEFAULT 'consultant',
        state_id INT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (state_id) REFERENCES states(id)
      )
    `);

    // Crear tabla de equipos si no existe
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS equipment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        inventory_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        type ENUM('desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'radio_communication', 'sim_chip', 'roaming', 'other') NOT NULL,
        brand VARCHAR(100),
        model VARCHAR(100),
        specifications TEXT,
        status ENUM('active', 'maintenance', 'out_of_service', 'disposed') DEFAULT 'active',
        state_id INT NOT NULL,
        assigned_to VARCHAR(100),
        location_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (state_id) REFERENCES states(id)
      )
    `);

    // Siempre actualizar los estados con los nombres venezolanos correctos
    console.log('🔄 Actualizando estados con nombres venezolanos...');
    
    // Verificar si hay equipos antes de limpiar estados
    const equipmentCount = await executeQuery('SELECT COUNT(*) as count FROM equipment');
    const hasEquipment = equipmentCount[0].count > 0;
    
    if (hasEquipment) {
      console.log('⚠️ Hay equipos en la base de datos, no se pueden eliminar estados');
      console.log('📊 Verificando estados existentes...');
      
      // Verificar qué estados existen
      const existingStates = await executeQuery('SELECT id, name, code FROM states');
      console.log(`📋 Estados existentes: ${existingStates.length}`);
      
      // Solo insertar estados que no existan
      const states = [
        { name: 'Dirección', code: 'DIR' },
        { name: 'Carabobo', code: 'CAR' },
        { name: 'Anzoátegui', code: 'ANZ' },
        { name: 'Bolívar', code: 'BOL' },
        { name: 'Barinas', code: 'BAR' },
        { name: 'Zulia', code: 'ZUL' },
        { name: 'Capital', code: 'CAP' }
      ];
      
      for (const state of states) {
        const existingState = await executeQuery('SELECT id FROM states WHERE name = ? OR code = ?', [state.name, state.code]);
        if (existingState.length === 0) {
          await executeQuery('INSERT INTO states (name, code) VALUES (?, ?)', [state.name, state.code]);
          console.log(`   ✅ Insertado: ${state.name} (${state.code})`);
        } else {
          console.log(`   ⏭️ Ya existe: ${state.name} (${state.code})`);
        }
      }
    } else {
      // No hay equipos, se puede limpiar estados
      console.log('🗑️ Limpiando estados existentes...');
      await executeQuery('DELETE FROM states');
      await executeQuery('ALTER TABLE states AUTO_INCREMENT = 1');
      
      // Insertar nuevos estados venezolanos
      console.log('📝 Insertando nuevos estados venezolanos...');
      const states = [
        { name: 'Dirección', code: 'DIR' },
        { name: 'Carabobo', code: 'CAR' },
        { name: 'Anzoátegui', code: 'ANZ' },
        { name: 'Bolívar', code: 'BOL' },
        { name: 'Barinas', code: 'BAR' },
        { name: 'Zulia', code: 'ZUL' },
        { name: 'Capital', code: 'CAP' }
      ];

      for (const state of states) {
        await executeQuery('INSERT INTO states (name, code) VALUES (?, ?)', [state.name, state.code]);
        console.log(`   ✅ Insertado: ${state.name} (${state.code})`);
      }
    }

    // Verificar estado actual de la base de datos
    const finalEquipmentCount = await executeQuery('SELECT COUNT(*) as count FROM equipment');
    const usersCount = await executeQuery('SELECT COUNT(*) as count FROM users');

    console.log('📊 Estado actual de la base de datos:');
    console.log(`   - Equipos: ${finalEquipmentCount[0].count}`);
    console.log(`   - Usuarios: ${usersCount[0].count}`);

    console.log('✅ Base de datos inicializada correctamente');
    console.log('📊 Estados/regiones venezolanos configurados:');
    const allStates = [
      { name: 'Dirección', code: 'DIR' },
      { name: 'Carabobo', code: 'CAR' },
      { name: 'Anzoátegui', code: 'ANZ' },
      { name: 'Bolívar', code: 'BOL' },
      { name: 'Barinas', code: 'BAR' },
      { name: 'Zulia', code: 'ZUL' },
      { name: 'Capital', code: 'CAP' }
    ];
    allStates.forEach((state, index) => {
      console.log(`   ${index + 1}. ${state.name} (${state.code})`);
    });

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
};

module.exports = { initializeDatabase }; 
