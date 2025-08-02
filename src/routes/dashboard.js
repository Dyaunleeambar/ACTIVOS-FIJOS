const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  getDashboardStats, 
  getEquipmentTypeStats, 
  getDashboardCharts 
} = require('../controllers/dashboardController');

// Obtener estadísticas del dashboard
router.get('/stats', authenticateToken, getDashboardStats);

// Obtener estadísticas por tipo de equipo
router.get('/equipment-type-stats', authenticateToken, getEquipmentTypeStats);

// Obtener gráficos del dashboard
router.get('/charts', authenticateToken, getDashboardCharts);

module.exports = router; 
