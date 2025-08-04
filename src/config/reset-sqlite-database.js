const fs = require('fs');
const path = require('path');
const { executeQuery, executeUpdate, initializeDatabase, insertTestData } = require('./database-sqlite');

const resetSQLiteDatabase = async () => {
  try {
    console.log('🗑️ Limpiando base de datos SQLite...');
    
    // Ruta del archivo de base de datos
    const dbPath = path.join(__dirname, '../../data/sistema_gestion_medios.db');
    
    // Verificar si existe el archivo de base de datos
    if (fs.existsSync(dbPath)) {
      console.log('📁 Eliminando archivo de base de datos existente...');
      fs.unlinkSync(dbPath);
      console.log('✅ Archivo de base de datos eliminado');
    }
    
    // Crear directorio data si no existe
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Directorio data creado');
    }
    
    // Reinicializar la base de datos
    console.log('🔧 Reinicializando base de datos...');
    await initializeDatabase();
    
    // Insertar datos de prueba
    console.log('📝 Insertando datos de prueba...');
    await insertTestData();
    
    // Verificar que se insertaron correctamente
    const equipmentCount = await executeQuery('SELECT COUNT(*) as count FROM equipment');
    const usersCount = await executeQuery('SELECT COUNT(*) as count FROM users');
    const statesCount = await executeQuery('SELECT COUNT(*) as count FROM states');
    
    console.log('\n📊 Base de datos reinicializada:');
    console.log(`   - Equipos: ${equipmentCount[0].count}`);
    console.log(`   - Usuarios: ${usersCount[0].count}`);
    console.log(`   - Estados: ${statesCount[0].count}`);
    
    console.log('\n✅ Base de datos SQLite limpiada y reinicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
    throw error;
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  resetSQLiteDatabase().then(() => {
    console.log('🎯 Proceso completado');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { resetSQLiteDatabase }; 
