const bcrypt = require('bcryptjs');
const { executeQuery } = require('./database-sqlite');

const resetAdminPassword = async () => {
  try {
    console.log('🔑 Restableciendo contraseña del usuario admin...');
    
    // Contraseña a establecer
    const newPassword = 'admin123';
    
    // Generar hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Actualizar la contraseña del usuario admin
    const result = await executeQuery(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );
    
    if (result.changes > 0) {
      console.log('✅ Contraseña del usuario admin restablecida exitosamente');
      console.log('📋 Credenciales actualizadas:');
      console.log('   Usuario: admin');
      console.log('   Contraseña: admin123');
    } else {
      console.log('⚠️  No se encontró el usuario admin. Asegúrate de que existe.');
    }
    
  } catch (error) {
    console.error('❌ Error al restablecer la contraseña:', error);
    throw error;
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  resetAdminPassword()
    .then(() => {
      console.log('🎯 Proceso completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { resetAdminPassword };
