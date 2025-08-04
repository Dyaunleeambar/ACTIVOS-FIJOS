const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const equipmentController = require('../controllers/equipmentController');
const { authenticateToken, authorizeRole, authorizeEquipmentAccess } = require('../middleware/auth');
const { 
  validateCreateEquipment, 
  validateUpdateEquipment, 
  validateId, 
  validateStateId,
  validateExportFilters
} = require('../middleware/validation');

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'equipment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// GET /api/equipment/stats - Obtener estadísticas de equipos
router.get('/stats', authenticateToken, equipmentController.getEquipmentStats);

// GET /api/equipment - Obtener todos los equipos
router.get('/', authenticateToken, equipmentController.getAllEquipment);

// GET /api/equipment/export - Exportar equipos a Excel (DEBE IR ANTES DE /:id)
router.get('/export', 
  authenticateToken, 
  validateExportFilters,
  equipmentController.exportToExcel
);

// GET /api/equipment/template - Descargar plantilla Excel
router.get('/template', 
  authenticateToken, 
  equipmentController.downloadTemplate
);

// GET /api/equipment/assigned - Listar equipos con asignaciones (temporal)
router.get('/assigned', authenticateToken, equipmentController.getAssignedEquipment);

// GET /api/equipment/assigned-dev - Listar equipos con asignaciones (sin autenticación para desarrollo)
router.get('/assigned-dev', equipmentController.getAssignedEquipment);

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
  upload.single('file'),
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

// GET /api/equipment/:id - Obtener equipo por ID (DEBE IR DESPUÉS DE LAS RUTAS ESPECÍFICAS)
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

// PUT /api/equipment/:id/dev - Actualizar equipo (sin autenticación para desarrollo)
router.put('/:id/dev', equipmentController.updateEquipment);

module.exports = router; 
