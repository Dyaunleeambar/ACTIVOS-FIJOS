require('dotenv').config();
const { executeQuery } = require('./database');

const updateDatabase = async () => {
  try {
    console.log('🔧 Actualizando esquema de base de datos...');

    // Verificar si la columna assigned_to ya es VARCHAR
    const checkColumnQuery = `
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'equipment' 
      AND COLUMN_NAME = 'assigned_to'
    `;
    
    const columnInfo = await executeQuery(checkColumnQuery);
    
    if (columnInfo.length > 0) {
      const columnType = columnInfo[0].COLUMN_TYPE;
      console.log('🔍 Tipo actual de assigned_to:', columnType);
      
      if (columnType.includes('int')) {
        console.log('🔄 Cambiando assigned_to de INT a VARCHAR...');
        
        // Cambiar assigned_to de INT a VARCHAR
        await executeQuery(`
          ALTER TABLE equipment 
          MODIFY COLUMN assigned_to VARCHAR(100)
        `);
        
        console.log('✅ assigned_to cambiado a VARCHAR(100)');
      } else {
        console.log('✅ assigned_to ya es VARCHAR');
      }
    }

    // Verificar si existen las columnas de seguridad
    const checkSecurityColumnsQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'equipment' 
      AND COLUMN_NAME IN ('security_username', 'security_password', 'access_details')
    `;
    
    const securityColumns = await executeQuery(checkSecurityColumnsQuery);
    
    if (securityColumns.length > 0) {
      console.log('🔄 Eliminando columnas de seguridad...');
      
      // Eliminar columnas de seguridad si existen
      for (const column of securityColumns) {
        const columnName = column.COLUMN_NAME;
        console.log(`🗑️ Eliminando columna: ${columnName}`);
        await executeQuery(`ALTER TABLE equipment DROP COLUMN ${columnName}`);
      }
      
      console.log('✅ Columnas de seguridad eliminadas');
    } else {
      console.log('✅ No hay columnas de seguridad para eliminar');
    }

    // Verificar si existe la columna location_details
    const checkLocationQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'equipment' 
      AND COLUMN_NAME = 'location_details'
    `;
    
    const locationColumn = await executeQuery(checkLocationQuery);
    
    if (locationColumn.length === 0) {
      console.log('🔄 Agregando columna location_details...');
      
      // Agregar columna location_details si no existe
      await executeQuery(`
        ALTER TABLE equipment 
        ADD COLUMN location_details TEXT
      `);
      
      console.log('✅ Columna location_details agregada');
    } else {
      console.log('✅ Columna location_details ya existe');
    }

    console.log('✅ Esquema de base de datos actualizado correctamente');

  } catch (error) {
    console.error('❌ Error actualizando esquema de base de datos:', error);
    throw error;
  }
};

module.exports = { updateDatabase }; 
