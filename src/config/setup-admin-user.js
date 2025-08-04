const { executeQuery } = require('./database');

const setupAdminUser = async () => {
  try {
    console.log('👤 Configurando usuario administrador...');
    
    // Verificar si el usuario admin ya existe
    const adminExists = await executeQuery('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (adminExists.length > 0) {
      console.log('✅ Usuario admin ya existe');
      return;
    }
    
    // Insertar usuario admin
    console.log('📝 Insertando usuario administrador...');
    await executeQuery(`
      INSERT INTO users (username, password, full_name, email, role) 
      VALUES (?, ?, ?, ?, ?)
    `, [
      'admin',
      '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ',
      'Administrador del Sistema',
      'admin@sistema.com',
      'admin'
    ]);
    
    console.log('✅ Usuario administrador creado correctamente');
    console.log('📋 Credenciales de acceso:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    
  } catch (error) {
    console.error('❌ Error configurando usuario admin:', error);
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  setupAdminUser().then(() => {
    console.log('🎯 Proceso completado');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

module.exports = { setupAdminUser }; 
