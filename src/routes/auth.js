const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');

// POST /api/auth/login - Login de usuario
router.post('/login', validateLogin, authController.login);

// GET /api/auth/profile - Obtener perfil del usuario actual
router.get('/profile', authenticateToken, authController.getProfile);

// POST /api/auth/change-password - Cambiar password del usuario actual
router.post('/change-password', authenticateToken, authController.changePassword);

// POST /api/auth/logout - Logout de usuario
router.post('/logout', authenticateToken, authController.logout);

// GET /api/auth/verify - Verificar token
router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router; 
