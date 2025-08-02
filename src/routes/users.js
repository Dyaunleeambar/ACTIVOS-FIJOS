const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/users - Obtener todos los usuarios (para asignaciones)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { executeQuery } = require('../config/database');
    
    const query = `
      SELECT 
        id,
        username,
        full_name,
        email,
        role,
        state_id,
        created_at
      FROM users
      ORDER BY full_name ASC
    `;

    const users = await executeQuery(query);

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { executeQuery } = require('../config/database');
    
    const query = `
      SELECT 
        id,
        username,
        full_name,
        email,
        role,
        state_id,
        created_at
      FROM users
      WHERE id = ?
    `;

    const users = await executeQuery(query, [id]);

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router; 
