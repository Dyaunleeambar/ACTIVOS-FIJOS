const { body, param, query, validationResult } = require('express-validator');

// Función para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validaciones para autenticación
const validateLogin = [
  body('username').notEmpty().withMessage('Username es requerido'),
  body('password').notEmpty().withMessage('Password es requerido'),
  handleValidationErrors
];

// Validaciones para usuarios
const validateCreateUser = [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres'),
  body('email').isEmail().withMessage('Email debe ser válido'),
  body('password').isLength({ min: 6 }).withMessage('Password debe tener al menos 6 caracteres'),
  body('full_name').notEmpty().withMessage('Nombre completo es requerido'),
  body('role').isIn(['admin', 'manager', 'consultant']).withMessage('Rol debe ser admin, manager o consultant'),
  body('state_id').optional().isInt().withMessage('ID de estado debe ser un número entero'),
  handleValidationErrors
];

const validateUpdateUser = [
  param('id').isInt().withMessage('ID debe ser un número entero'),
  body('username').optional().isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres'),
  body('email').optional().isEmail().withMessage('Email debe ser válido'),
  body('full_name').optional().notEmpty().withMessage('Nombre completo no puede estar vacío'),
  body('role').optional().isIn(['admin', 'manager', 'consultant']).withMessage('Rol debe ser admin, manager o consultant'),
  body('state_id').optional().isInt().withMessage('ID de estado debe ser un número entero'),
  handleValidationErrors
];

// Validaciones para equipos
const validateCreateEquipment = [
  body('inventory_number').notEmpty().withMessage('Número de inventario es requerido'),
  // Nombre opcional para permitir comunicaciones sin nombre explícito
  body('name').optional().notEmpty().withMessage('Nombre del equipo no puede estar vacío si se envía'),
  body('type').isIn(['desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'monitor', 'radio_communication', 'sim_chip', 'roaming', 'other']).withMessage('Tipo de equipo inválido'),
  body('brand').optional().isString().withMessage('Marca debe ser texto'),
  body('model').optional().isString().withMessage('Modelo debe ser texto'),
  body('specifications').optional().isString().withMessage('Especificaciones debe ser texto'),
  body('status').optional().isIn(['active', 'maintenance', 'out_of_service', 'disposed']).withMessage('Estado inválido'),
  body('state_id').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // Permitir valores nulos/vacíos para campos opcionales
    }
    return Number.isInteger(Number(value));
  }).withMessage('ID de estado debe ser un número entero o estar vacío'),
  body('assigned_to').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // Permitir valores nulos/vacíos para campos opcionales
    }
    return typeof value === 'string'; // assigned_to es un string (nombre de la persona)
  }).withMessage('Responsable de equipo debe ser texto o estar vacío'),
  body('security_username').optional().isString().withMessage('Username de seguridad debe ser texto'),
  handleValidationErrors
];

const validateUpdateEquipment = [
  param('id').isInt().withMessage('ID debe ser un número entero'),
  body('name').optional().notEmpty().withMessage('Nombre del equipo no puede estar vacío'),
  body('type').optional().isIn(['desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'monitor', 'radio_communication', 'sim_chip', 'roaming', 'other']).withMessage('Tipo de equipo inválido'),
  body('brand').optional().isString().withMessage('Marca debe ser texto'),
  body('model').optional().isString().withMessage('Modelo debe ser texto'),
  body('specifications').optional().isString().withMessage('Especificaciones debe ser texto'),
  body('status').optional().isIn(['active', 'maintenance', 'out_of_service', 'disposed']).withMessage('Estado inválido'),
  body('state_id').optional().isInt().withMessage('ID de estado debe ser un número entero'),
  body('assigned_to').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // Permitir valores nulos/vacíos para campos opcionales
    }
    return typeof value === 'string'; // assigned_to es un string (nombre de la persona)
  }).withMessage('Responsable de equipo debe ser texto o estar vacío'),
  body('security_username').optional().isString().withMessage('Username de seguridad debe ser texto'),
  handleValidationErrors
];

// Validaciones para asignaciones
const validateCreateAssignment = [
  body('equipment_id').isInt().withMessage('ID de equipo es requerido y debe ser un número entero'),
  body('user_id').isInt().withMessage('ID de usuario es requerido y debe ser un número entero'),
  body('assigned_by').isInt().withMessage('ID de usuario que asigna es requerido y debe ser un número entero'),
  body('notes').optional().isString().withMessage('Notas debe ser texto'),
  handleValidationErrors
];

const validateUpdateAssignment = [
  param('id').isInt().withMessage('ID debe ser un número entero'),
  body('notes').optional().isString().withMessage('Notas debe ser texto'),
  handleValidationErrors
];

// Validaciones para movimientos
const validateCreateMovement = [
  body('equipment_id').isInt().withMessage('ID de equipo es requerido y debe ser un número entero'),
  body('to_state_id').isInt().withMessage('ID de estado destino es requerido y debe ser un número entero'),
  body('from_state_id').optional().isInt().withMessage('ID de estado origen debe ser un número entero'),
  body('from_location').optional().isString().withMessage('Ubicación origen debe ser texto'),
  body('to_location').optional().isString().withMessage('Ubicación destino debe ser texto'),
  body('reason').optional().isString().withMessage('Razón debe ser texto'),
  handleValidationErrors
];

// Validaciones para datos de seguridad
const validateCreateSecurityData = [
  body('equipment_id').isInt().withMessage('ID de equipo es requerido y debe ser un número entero'),
  body('username').optional().isString().withMessage('Username debe ser texto'),
  body('password').optional().isString().withMessage('Password debe ser texto'),
  body('access_details').optional().isString().withMessage('Detalles de acceso debe ser texto'),
  handleValidationErrors
];

const validateUpdateSecurityData = [
  param('id').isInt().withMessage('ID debe ser un número entero'),
  body('username').optional().isString().withMessage('Username debe ser texto'),
  body('password').optional().isString().withMessage('Password debe ser texto'),
  body('access_details').optional().isString().withMessage('Detalles de acceso debe ser texto'),
  handleValidationErrors
];

// Validaciones para propuestas de baja
const validateCreateDisposalProposal = [
  body('equipment_id').isInt().withMessage('ID de equipo es requerido y debe ser un número entero'),
  body('reason').isIn(['damage', 'obsolescence', 'loss']).withMessage('Razón debe ser damage, obsolescence o loss'),
  body('description').optional().isString().withMessage('Descripción debe ser texto'),
  handleValidationErrors
];

const validateUpdateDisposalProposal = [
  param('id').isInt().withMessage('ID debe ser un número entero'),
  body('status').optional().isIn(['pending', 'approved', 'rejected', 'completed']).withMessage('Estado inválido'),
  body('description').optional().isString().withMessage('Descripción debe ser texto'),
  handleValidationErrors
];

// Validaciones para exportación (versión permisiva)
const validateExportFilters = [
  (req, res, next) => {
    console.log('🔍 validateExportFilters - Query parameters:', req.query);
    console.log('🔍 validateExportFilters - Headers:', req.headers);
    
    // Permitir cualquier parámetro para diagnóstico
    console.log('✅ Validación de exportación exitosa (permitiendo todos los parámetros)');
    next();
  }
];

// Validaciones para reportes
const validateReportFilters = [
  query('state_id').optional().isInt().withMessage('ID de estado debe ser un número entero'),
  query('type').optional().isIn(['desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'monitor', 'radio_communication', 'sim_chip', 'roaming', 'other']).withMessage('Tipo de equipo inválido'),
  query('status').optional().isIn(['active', 'maintenance', 'out_of_service', 'disposed']).withMessage('Estado inválido'),
  query('start_date').optional().isISO8601().withMessage('Fecha de inicio debe ser válida'),
  query('end_date').optional().isISO8601().withMessage('Fecha de fin debe ser válida'),
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número entero mayor a 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser un número entero entre 1 y 100'),
  handleValidationErrors
];

// Validaciones para parámetros de ruta
const validateId = [
  param('id').isInt().withMessage('ID debe ser un número entero'),
  handleValidationErrors
];

const validateStateId = [
  param('stateId').isInt().withMessage('ID de estado debe ser un número entero'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
  validateCreateEquipment,
  validateUpdateEquipment,
  validateCreateAssignment,
  validateUpdateAssignment,
  validateCreateMovement,
  validateCreateSecurityData,
  validateUpdateSecurityData,
  validateCreateDisposalProposal,
  validateUpdateDisposalProposal,
  validateExportFilters,
  validateReportFilters,
  validateId,
  validateStateId
}; 
