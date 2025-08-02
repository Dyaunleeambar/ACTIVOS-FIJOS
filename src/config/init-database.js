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
        assigned_to INT,
        security_username VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (state_id) REFERENCES states(id),
        FOREIGN KEY (assigned_to) REFERENCES users(id)
      )
    `);

    // Insertar estados de ejemplo
    const states = [
      { name: 'Estado 1', code: 'EST1' },
      { name: 'Estado 2', code: 'EST2' },
      { name: 'Estado 3', code: 'EST3' },
      { name: 'Estado 4', code: 'EST4' },
      { name: 'Estado 5', code: 'EST5' }
    ];

    for (const state of states) {
      await executeQuery(
        'INSERT IGNORE INTO states (name, code) VALUES (?, ?)',
        [state.name, state.code]
      );
    }

    // Insertar usuarios de ejemplo
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
        'INSERT IGNORE INTO users (username, password, full_name, email, role, state_id) VALUES (?, ?, ?, ?, ?, ?)',
        [user.username, user.password, user.full_name, user.email, user.role, user.state_id]
      );
    }

    // Insertar equipos de ejemplo
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
        assigned_to: 2,
        security_username: 'admin'
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
        assigned_to: 3,
        security_username: 'manager1'
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
        security_username: 'consultant1'
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
        security_username: 'admin'
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
        security_username: 'admin'
      }
    ];

    for (const item of equipment) {
      await executeQuery(`
        INSERT IGNORE INTO equipment (
          inventory_number, name, type, brand, model, specifications,
          status, state_id, assigned_to, security_username
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        item.inventory_number, item.name, item.type, item.brand, item.model,
        item.specifications, item.status, item.state_id, item.assigned_to,
        item.security_username
      ]);
    }

    console.log('✅ Base de datos inicializada correctamente');
    console.log('📊 Datos de ejemplo insertados:');
    console.log('   - 5 estados/regiones');
    console.log('   - 3 usuarios (admin, manager, consultant)');
    console.log('   - 5 equipos de ejemplo');

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
};

module.exports = { initializeDatabase }; 
