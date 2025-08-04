const { executeQuery } = require('./database');

const resetDatabase = async () => {
  try {
    console.log('🗑️ Limpiando base de datos...');
    
    // Eliminar todos los datos de las tablas
    await executeQuery('DELETE FROM equipment');
    await executeQuery('DELETE FROM users WHERE username != "admin"');
    await executeQuery('DELETE FROM states');
    
    // Resetear auto-increment
    await executeQuery('ALTER TABLE equipment AUTO_INCREMENT = 1');
    await executeQuery('ALTER TABLE users AUTO_INCREMENT = 2');
    await executeQuery('ALTER TABLE states AUTO_INCREMENT = 1');
    
    console.log('✅ Base de datos limpiada correctamente');
    
    // Reinicializar la base de datos
    const { initializeDatabase } = require('./init-database');
    await initializeDatabase();
    
    console.log('✅ Base de datos reinicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  resetDatabase().then(() => {
    console.log('🎯 Proceso completado');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { resetDatabase }; 
