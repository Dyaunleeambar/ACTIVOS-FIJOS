require('dotenv').config();
const { executeQuery } = require('./database');

const updateDatabase = async () => {
  try {
    console.log('🔧 Actualizando base de datos...');
    console.log('📡 Conectando a la base de datos...');
    console.log('🔑 Configuración de BD:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Verificar si la columna security_username existe
    const checkColumnQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'sistema_gestion_medios' 
      AND TABLE_NAME = 'equipment' 
      AND COLUMN_NAME = 'security_username'
    `;

    console.log('🔍 Verificando columna security_username...');
    const columnExists = await executeQuery(checkColumnQuery);
    console.log('📊 Resultado de verificación:', columnExists);

    if (columnExists.length === 0) {
      console.log('➕ Agregando columna security_username a la tabla equipment...');
      
      // Agregar la columna security_username
      await executeQuery(`
        ALTER TABLE equipment 
        ADD COLUMN security_username VARCHAR(50) NULL
      `);
      
      console.log('✅ Columna security_username agregada exitosamente');
    } else {
      console.log('✅ La columna security_username ya existe');
    }

    // Verificar si la tabla assignments existe
    const checkAssignmentsTable = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'sistema_gestion_medios' 
      AND TABLE_NAME = 'assignments'
    `;

    console.log('🔍 Verificando tabla assignments...');
    const assignmentsTableExists = await executeQuery(checkAssignmentsTable);
    console.log('📊 Resultado de verificación assignments:', assignmentsTableExists);

    if (assignmentsTableExists.length === 0) {
      console.log('➕ Creando tabla assignments...');
      
      // Crear tabla assignments
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS assignments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          equipment_id INT NOT NULL,
          user_id INT NOT NULL,
          assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          returned_at TIMESTAMP NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (equipment_id) REFERENCES equipment(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      
      console.log('✅ Tabla assignments creada exitosamente');
    } else {
      console.log('✅ La tabla assignments ya existe');
    }

    // Verificar si la tabla movements existe
    const checkMovementsTable = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'sistema_gestion_medios' 
      AND TABLE_NAME = 'movements'
    `;

    console.log('🔍 Verificando tabla movements...');
    const movementsTableExists = await executeQuery(checkMovementsTable);
    console.log('📊 Resultado de verificación movements:', movementsTableExists);

    if (movementsTableExists.length === 0) {
      console.log('➕ Creando tabla movements...');
      
      // Crear tabla movements
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS movements (
          id INT AUTO_INCREMENT PRIMARY KEY,
          equipment_id INT NOT NULL,
          movement_type ENUM('in', 'out', 'transfer', 'maintenance', 'disposal') NOT NULL,
          from_location VARCHAR(100),
          to_location VARCHAR(100),
          from_user_id INT,
          to_user_id INT,
          movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (equipment_id) REFERENCES equipment(id),
          FOREIGN KEY (from_user_id) REFERENCES users(id),
          FOREIGN KEY (to_user_id) REFERENCES users(id)
        )
      `);
      
      console.log('✅ Tabla movements creada exitosamente');
    } else {
      console.log('✅ La tabla movements ya existe');
    }

    // Verificar si la tabla disposals existe
    const checkDisposalsTable = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'sistema_gestion_medios' 
      AND TABLE_NAME = 'disposals'
    `;

    console.log('🔍 Verificando tabla disposals...');
    const disposalsTableExists = await executeQuery(checkDisposalsTable);
    console.log('📊 Resultado de verificación disposals:', disposalsTableExists);

    if (disposalsTableExists.length === 0) {
      console.log('➕ Creando tabla disposals...');
      
      // Crear tabla disposals
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS disposals (
          id INT AUTO_INCREMENT PRIMARY KEY,
          equipment_id INT NOT NULL,
          reason ENUM('damage', 'obsolescence', 'loss', 'other') NOT NULL,
          description TEXT,
          proposed_by INT NOT NULL,
          approved_by INT,
          status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
          proposed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          approved_at TIMESTAMP NULL,
          completed_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (equipment_id) REFERENCES equipment(id),
          FOREIGN KEY (proposed_by) REFERENCES users(id),
          FOREIGN KEY (approved_by) REFERENCES users(id)
        )
      `);
      
      console.log('✅ Tabla disposals creada exitosamente');
    } else {
      console.log('✅ La tabla disposals ya existe');
    }

    console.log('✅ Base de datos actualizada correctamente');

  } catch (error) {
    console.error('❌ Error actualizando base de datos:', error);
    console.error('📋 Detalles del error:', error.message);
    console.error('🔍 Stack trace:', error.stack);
    throw error;
  }
};

// Ejecutar la actualización si el archivo se ejecuta directamente
if (require.main === module) {
  updateDatabase()
    .then(() => {
      console.log('🎉 Actualización completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en la actualización:', error);
      process.exit(1);
    });
}

module.exports = { updateDatabase }; 