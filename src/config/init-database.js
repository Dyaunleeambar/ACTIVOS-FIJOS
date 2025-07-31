const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4'
};

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔧 Inicializando base de datos...');
    
    // Conectar sin especificar base de datos
    connection = await mysql.createConnection(dbConfig);
    
    // Crear base de datos si no existe
    const dbName = process.env.DB_NAME || 'sistema_gestion_medios';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Base de datos '${dbName}' creada/verificada`);
    
    // Usar la base de datos
    await connection.query(`USE ${dbName}`);
    
    // Crear tabla de estados
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS states (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(10) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla states creada');
    
    // Crear tabla de usuarios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'manager', 'consultant') NOT NULL,
        state_id INT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (state_id) REFERENCES states(id)
      )
    `);
    console.log('✅ Tabla users creada');
    
    // Crear tabla de equipos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS equipment (
        id INT PRIMARY KEY AUTO_INCREMENT,
        inventory_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        type ENUM('desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'radio_communication', 'sim_chip', 'roaming', 'other') NOT NULL,
        brand VARCHAR(50),
        model VARCHAR(50),
        specifications TEXT,
        status ENUM('active', 'maintenance', 'out_of_service', 'disposed') DEFAULT 'active',
        state_id INT,
        assigned_to INT,
        location_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (state_id) REFERENCES states(id),
        FOREIGN KEY (assigned_to) REFERENCES users(id)
      )
    `);
    console.log('✅ Tabla equipment creada');
    
    // Crear tabla de asignaciones
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS assignments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        equipment_id INT NOT NULL,
        user_id INT NOT NULL,
        assigned_by INT NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        returned_at TIMESTAMP NULL,
        notes TEXT,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (assigned_by) REFERENCES users(id)
      )
    `);
    console.log('✅ Tabla assignments creada');
    
    // Crear tabla de movimientos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS movements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        equipment_id INT NOT NULL,
        from_state_id INT,
        to_state_id INT NOT NULL,
        from_location TEXT,
        to_location TEXT,
        moved_by INT NOT NULL,
        moved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reason TEXT,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id),
        FOREIGN KEY (from_state_id) REFERENCES states(id),
        FOREIGN KEY (to_state_id) REFERENCES states(id),
        FOREIGN KEY (moved_by) REFERENCES users(id)
      )
    `);
    console.log('✅ Tabla movements creada');
    
    // Crear tabla de datos de seguridad
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS security_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        equipment_id INT NOT NULL,
        username VARCHAR(100),
        password VARCHAR(255),
        access_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id)
      )
    `);
    console.log('✅ Tabla security_data creada');
    
    // Crear tabla de propuestas de baja
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS disposal_proposals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        equipment_id INT NOT NULL,
        proposed_by INT NOT NULL,
        reason ENUM('damage', 'obsolescence', 'loss') NOT NULL,
        description TEXT,
        status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
        approved_by INT,
        approved_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id),
        FOREIGN KEY (proposed_by) REFERENCES users(id),
        FOREIGN KEY (approved_by) REFERENCES users(id)
      )
    `);
    console.log('✅ Tabla disposal_proposals creada');
    
    // Insertar datos de ejemplo
    await insertSampleData(connection);
    
    console.log('🎉 Base de datos inicializada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function insertSampleData(connection) {
  try {
    console.log('📝 Insertando datos de ejemplo...');
    
    // Insertar estados de ejemplo
    const states = [
      { name: 'Capital', code: 'CAP' },
      { name: 'Estado 1', code: 'EST1' },
      { name: 'Estado 2', code: 'EST2' },
      { name: 'Estado 3', code: 'EST3' },
      { name: 'Estado 4', code: 'EST4' },
      { name: 'Estado 5', code: 'EST5' }
    ];
    
    for (const state of states) {
      await connection.execute(
        'INSERT IGNORE INTO states (name, code) VALUES (?, ?)',
        [state.name, state.code]
      );
    }
    console.log('✅ Estados insertados');
    
    // Insertar usuario administrador
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await connection.execute(`
      INSERT IGNORE INTO users (username, password, email, full_name, role, state_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['admin', adminPassword, 'admin@empresa.com', 'Administrador IT', 'admin', 1]);
    
    console.log('✅ Usuario administrador creado (username: admin, password: admin123)');
    
    // Insertar usuarios de ejemplo
    const users = [
      { username: 'manager1', password: 'manager123', email: 'manager1@empresa.com', full_name: 'Manager Estado 1', role: 'manager', state_id: 2 },
      { username: 'manager2', password: 'manager123', email: 'manager2@empresa.com', full_name: 'Manager Estado 2', role: 'manager', state_id: 3 },
      { username: 'consultant1', password: 'consultant123', email: 'consultant1@empresa.com', full_name: 'Consultor 1', role: 'consultant', state_id: 2 },
      { username: 'consultant2', password: 'consultant123', email: 'consultant2@empresa.com', full_name: 'Consultor 2', role: 'consultant', state_id: 3 }
    ];
    
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await connection.execute(`
        INSERT IGNORE INTO users (username, password, email, full_name, role, state_id) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [user.username, hashedPassword, user.email, user.full_name, user.role, user.state_id]);
    }
    console.log('✅ Usuarios de ejemplo creados');
    
    // Insertar equipos de ejemplo
    const equipment = [
      { inventory_number: 'INV-2024-001', name: 'PC Oficina Central', type: 'desktop', brand: 'Dell', model: 'OptiPlex 7090', specifications: 'Intel i7, 16GB RAM, 512GB SSD', state_id: 1 },
      { inventory_number: 'INV-2024-002', name: 'Laptop Gerencia', type: 'laptop', brand: 'HP', model: 'EliteBook 840', specifications: 'Intel i5, 8GB RAM, 256GB SSD', state_id: 2 },
      { inventory_number: 'INV-2024-003', name: 'Impresora Oficina', type: 'printer', brand: 'HP', model: 'LaserJet Pro', specifications: 'Impresora láser monocromática', state_id: 1 },
      { inventory_number: 'INV-2024-004', name: 'Servidor Principal', type: 'server', brand: 'Dell', model: 'PowerEdge R740', specifications: 'Intel Xeon, 32GB RAM, 2TB HDD', state_id: 1 },
      { inventory_number: 'INV-2024-005', name: 'Router Principal', type: 'router', brand: 'Cisco', model: 'ISR 4321', specifications: 'Router empresarial', state_id: 1 }
    ];
    
    for (const eq of equipment) {
      await connection.execute(`
        INSERT IGNORE INTO equipment (inventory_number, name, type, brand, model, specifications, state_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [eq.inventory_number, eq.name, eq.type, eq.brand, eq.model, eq.specifications, eq.state_id]);
    }
    console.log('✅ Equipos de ejemplo creados');
    
    console.log('✅ Datos de ejemplo insertados exitosamente');
    
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🚀 Inicialización completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error durante la inicialización:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase }; 
