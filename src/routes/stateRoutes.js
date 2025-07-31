const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Obtener todos los estados (público - para formularios)
router.get('/', stateController.getAllStates);

// Obtener un estado por ID
router.get('/:id', stateController.getStateById);

// Crear nuevo estado (solo admin)
router.post('/', 
  authenticateToken, 
  authorizeRole(['admin']), 
  stateController.createState
);

// Actualizar estado (solo admin)
router.put('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  stateController.updateState
);

// Eliminar estado (solo admin)
router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  stateController.deleteState
);

module.exports = router; 
