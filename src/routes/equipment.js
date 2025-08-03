const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { authenticateToken, authorizeRole, authorizeEquipmentAccess } = require('../middleware/auth');
const { 
  validateCreateEquipment, 
  validateUpdateEquipment, 
  validateId, 
  validateStateId 
} = require('../middleware/validation');

// GET /api/equipment/stats - Obtener estadísticas de equipos
router.get('/stats', authenticateToken, equipmentController.getEquipmentStats);

// GET /api/equipment - Obtener todos los equipos
router.get('/', authenticateToken, equipmentController.getAllEquipment);

// GET /api/equipment/:id - Obtener equipo por ID
router.get('/:id', authenticateToken, validateId, authorizeEquipmentAccess, equipmentController.getEquipmentById);

// POST /api/equipment - Crear nuevo equipo
router.post('/', 
  authenticateToken, 
  authorizeRole(['admin', 'manager']), 
  validateCreateEquipment, 
  equipmentController.createEquipment
);

// PUT /api/equipment/:id - Actualizar equipo
router.put('/:id', 
  authenticateToken, 
  authorizeRole(['admin', 'manager']), 
  validateId, 
  authorizeEquipmentAccess, 
  validateUpdateEquipment, 
  equipmentController.updateEquipment
);

// DELETE /api/equipment/:id - Eliminar equipo
router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['admin']), 
  validateId, 
  authorizeEquipmentAccess, 
  equipmentController.deleteEquipment
);

// GET /api/equipment/state/:stateId - Obtener equipos por estado
router.get('/state/:stateId', 
  authenticateToken, 
  validateStateId, 
  equipmentController.getEquipmentByState
);

// POST /api/equipment/upload-excel - Importar equipos desde Excel
router.post('/upload-excel', 
  authenticateToken, 
  authorizeRole(['admin', 'manager']), 
  equipmentController.uploadExcel
);

// POST /api/equipment/validate-import - Validar datos de importación
router.post('/validate-import', 
  authenticateToken, 
  authorizeRole(['admin', 'manager']), 
  equipmentController.validateImport
);

// POST /api/equipment/import - Confirmar importación
router.post('/import', 
  authenticateToken, 
  authorizeRole(['admin', 'manager']), 
  equipmentController.confirmImport
);

// GET /api/equipment/export - Exportar equipos a Excel
router.get('/export', 
  authenticateToken, 
  equipmentController.exportToExcel
);

// GET /api/equipment/template - Descargar plantilla Excel
router.get('/template', 
  authenticateToken, 
  equipmentController.downloadTemplate
);

module.exports = router; 