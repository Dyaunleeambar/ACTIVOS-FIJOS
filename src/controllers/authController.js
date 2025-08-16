const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database-sqlite');
const { generateToken } = require('../middleware/auth');

// Login de usuario
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por username
    const userQuery = `
      SELECT id, username, email, full_name, role, state_id, password
      FROM users 
      WHERE username = ?
      LIMIT 1
    `;
    const users = await executeQuery(userQuery, [username]);

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const user = users[0];

    // Verificar password
    console.log('🔐 Intento de login para usuario:', user.username);
    console.log('🔑 Hash de contraseña almacenado:', user.password);
    console.log('🔑 Contraseña recibida:', password);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Resultado de comparación de contraseña:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generateToken(user);

    // Remover password de la respuesta
    delete user.password;

    res.json({
      message: 'Login exitoso',
      user,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userQuery = `
      SELECT id, username, email, full_name, role, state_id, created_at, updated_at
      FROM users 
      WHERE id = ?
    `;
    const users = await executeQuery(userQuery, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Si el usuario es manager, incluir información del estado
    let user = users[0];
    if (user.role === 'manager' && user.state_id) {
      const stateQuery = 'SELECT id, name, code FROM states WHERE id = ?';
      const states = await executeQuery(stateQuery, [user.state_id]);
      if (states.length > 0) {
        user.state = states[0];
      }
    }

    res.json({
      user
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Cambiar password del usuario actual
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validar que se proporcionen ambos passwords
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Password actual y nuevo password son requeridos'
      });
    }

    // Obtener password actual del usuario
    const userQuery = 'SELECT password FROM users WHERE id = ?';
    const users = await executeQuery(userQuery, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // Verificar password actual
    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Password actual incorrecto'
      });
    }

    // Encriptar nuevo password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar password
    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
    await executeQuery(updateQuery, [hashedPassword, userId]);

    res.json({
      message: 'Password actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar password:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Logout (opcional, para invalidar tokens en el futuro)
const logout = async (req, res) => {
  try {
    // En una implementación más avanzada, aquí se podría invalidar el token
    // Por ahora, solo devolvemos un mensaje de éxito
    res.json({
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Verificar token (para validar tokens en el frontend)
const verifyToken = async (req, res) => {
  try {
    // El middleware de autenticación ya verificó el token
    // Solo devolvemos información del usuario
    res.json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  getProfile,
  changePassword,
  logout,
  verifyToken
}; 
