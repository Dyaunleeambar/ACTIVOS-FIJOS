const { executeQuery } = require('./database');

const resetDatabase = async () => {
  try {
    console.log('🔄 Reinicializando base de datos con nuevos estados...');

    // Limpiar datos existentes
    console.log('🗑️ Limpiando datos existentes...');
    await executeQuery('DELETE FROM equipment');
    await executeQuery('DELETE FROM users');
    await executeQuery('DELETE FROM states');
    
    // Resetear auto-increment
    await executeQuery('ALTER TABLE equipment AUTO_INCREMENT = 1');
    await executeQuery('ALTER TABLE users AUTO_INCREMENT = 1');
    await executeQuery('ALTER TABLE states AUTO_INCREMENT = 1');

    console.log('✅ Datos limpiados correctamente');

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
      await executeQuery(
        'INSERT INTO states (name, code) VALUES (?, ?)',
        [state.name, state.code]
      );
    }

    // Insertar usuarios de ejemplo
    console.log('👥 Insertando usuarios de ejemplo...');
    const users = [
      {
        username: 'admin',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ',
        full_name: 'Administrador del Sistema',
        email: 'admin@sistema.com',
        role: 'admin'
      },
      {
        username: 'manager1',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ',
        full_name: 'Juan Pérez',
        email: 'juan.perez@sistema.com',
        role: 'manager',
        state_id: 1
      },
      {
        username: 'consultant1',
        password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ',
        full_name: 'María García',
        email: 'maria.garcia@sistema.com',
        role: 'consultant',
        state_id: 1
      }
    ];

    for (const user of users) {
      await executeQuery(
        'INSERT INTO users (username, password, full_name, email, role, state_id) VALUES (?, ?, ?, ?, ?, ?)',
        [user.username, user.password, user.full_name, user.email, user.role, user.state_id]
      );
    }

    // Insertar equipos de ejemplo
    console.log('💻 Insertando equipos de ejemplo...');
    const equipment = [
      {
        inventory_number: 'INV-001',
        name: 'Laptop Dell Latitude 5520',
        type: 'laptop',
        brand: 'Dell',
        model: 'Latitude 5520',
        specifications: 'Intel i5-1135G7, 8GB RAM, 256GB SSD, Windows 10 Pro',
        status: 'active',
        state_id: 1,
        assigned_to: 'Juan Pérez',
        location_details: 'Oficina principal, piso 2'
      },
      {
        inventory_number: 'INV-002',
        name: 'Desktop HP EliteDesk 800',
        type: 'desktop',
        brand: 'HP',
        model: 'EliteDesk 800 G5',
        specifications: 'Intel i7-9700, 16GB RAM, 512GB SSD, Windows 10 Pro',
        status: 'active',
        state_id: 1,
        assigned_to: 'María García',
        location_details: 'Sala de reuniones, piso 1'
      },
      {
        inventory_number: 'INV-003',
        name: 'Impresora HP LaserJet Pro',
        type: 'printer',
        brand: 'HP',
        model: 'LaserJet Pro M404n',
        specifications: 'Impresora láser monocromática, 38 ppm, red Ethernet',
        status: 'active',
        state_id: 1,
        assigned_to: 'Carlos López',
        location_details: 'Área de impresión, piso 1'
      },
      {
        inventory_number: 'INV-004',
        name: 'Servidor Dell PowerEdge R740',
        type: 'server',
        brand: 'Dell',
        model: 'PowerEdge R740',
        specifications: 'Intel Xeon E5-2680 v4, 32GB RAM, 2TB HDD, Windows Server 2019',
        status: 'active',
        state_id: 1,
        assigned_to: 'Ana Rodríguez',
        location_details: 'Sala de servidores, sótano'
      },
      {
        inventory_number: 'INV-005',
        name: 'Router Cisco ISR 4321',
        type: 'router',
        brand: 'Cisco',
        model: 'ISR 4321',
        specifications: 'Router empresarial, 4 puertos Gigabit, IOS-XE',
        status: 'maintenance',
        state_id: 1,
        assigned_to: 'Luis Martínez',
        location_details: 'Sala de telecomunicaciones, piso 3'
      }
    ];

    for (const item of equipment) {
      await executeQuery(`
        INSERT INTO equipment (
          inventory_number, name, type, brand, model, specifications,
          status, state_id, assigned_to, location_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.inventory_number, item.name, item.type, item.brand, item.model,
        item.specifications, item.status, item.state_id, item.assigned_to,
        item.location_details
      ]);
    }

    console.log('✅ Base de datos reinicializada correctamente');
    console.log('📊 Nuevos datos insertados:');
    console.log('   - 7 estados/regiones venezolanos:');
    states.forEach((state, index) => {
      console.log(`     ${index + 1}. ${state.name} (${state.code})`);
    });
    console.log('   - 3 usuarios (admin, manager, consultant)');
    console.log('   - 5 equipos de ejemplo');

  } catch (error) {
    console.error('❌ Error reinicializando base de datos:', error);
    throw error;
  }
};

module.exports = { resetDatabase }; 