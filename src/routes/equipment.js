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

// GET /api/equipment/by-inventory/:inventory - Obtener equipo por inventory_number
router.get('/by-inventory/:inventory', authenticateToken, async (req, res) => {
  try {
    const { inventory } = req.params;
    const rows = await require('../config/database-sqlite').executeQuery(
      'SELECT *, proposed_disposal as proponerBaja FROM equipment WHERE inventory_number = ?',
      [inventory]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ equipment: rows[0] });
  } catch (err) {
    console.error('❌ Error en by-inventory:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/equipment/export - Exportar equipos a Excel (DEBE IR ANTES DE /:id)
router.get('/export', 
  authenticateToken, 
  validateExportFilters,
  equipmentController.exportToExcel
);

// POST /api/equipment/reorder - Reordenar equipos
router.post('/reorder', 
  authenticateToken, 
  authorizeRole(['admin', 'manager']), 
  equipmentController.reorderEquipment
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
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Error de Multer:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'El archivo es demasiado grande. Máximo 5MB'
        });
      }
      return res.status(400).json({
        error: 'Error al subir archivo: ' + err.message
      });
    } else if (err) {
      console.error('❌ Error de validación de archivo:', err);
      return res.status(400).json({
        error: err.message
      });
    }
    next();
  },
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
  (req, res, next) => {
    console.log('🚀 Petición POST /api/equipment/import recibida');
    console.log('📊 Headers:', req.headers);
    console.log('📋 Body:', req.body);
    next();
  },
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
