const { executeQuery } = require('../config/database-sqlite');

// Obtener estadísticas del dashboard (datos reales)
const getDashboardStats = async (req, res) => {
  try {
    // Ámbito por rol
    const user = req.user || {};
    const isManager = user.role === 'manager';
    const isConsultant = user.role === 'consultant';

    const whereParts = [];
    const params = [];
    let extraJoin = '';

    if (isManager) {
      whereParts.push('e.state_id = ?');
      params.push(user.state_id);
    } else if (isConsultant) {
      extraJoin = 'LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL';
      whereParts.push('a.user_id = ?');
      params.push(user.id);
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    // 1) Total de equipos
    const totalQuery = `
      SELECT COUNT(*) AS total
      FROM equipment e
      ${extraJoin}
      ${whereClause}
    `;
    const totalResult = await executeQuery(totalQuery, params);
    const totalEquipment = totalResult?.[0]?.total || 0;

    // 2) Equipos activos
    const activeQuery = `
      SELECT COUNT(*) AS total
      FROM equipment e
      ${extraJoin}
      ${whereClause}
      ${whereClause ? ' AND' : 'WHERE'} e.status = 'active'
    `;
    const activeResult = await executeQuery(activeQuery, params);
    const activeEquipment = activeResult?.[0]?.total || 0;

    // 3) Propuestas de baja reales (flag proposed_disposal)
    const proposalsQuery = `
      SELECT COUNT(*) AS total
      FROM equipment e
      ${extraJoin}
      ${whereClause}
      ${whereClause ? ' AND' : 'WHERE'} e.proposed_disposal = 1
    `;
    const proposalsResult = await executeQuery(proposalsQuery, params);
    const disposalProposals = proposalsResult?.[0]?.total || 0;

    // 4) Por tipo (resumen simple para tarjetas/mini-widgets)
    const typeQuery = `
      SELECT type, COUNT(*) AS total
      FROM equipment e
      ${extraJoin}
      ${whereClause}
      GROUP BY type
    `;
    const typeRows = await executeQuery(typeQuery, params);
    const typeTotals = (typeRows || []).reduce((acc, row) => {
      const t = row.type || 'other';
      acc[t] = row.total || 0;
      return acc;
    }, {});

    const equipmentByType = {
      totalLaptops: typeTotals['laptop'] || 0,
      totalPcs: typeTotals['desktop'] || 0,
      totalMonitors: typeTotals['monitor'] || 0,
      totalPrinters: typeTotals['printer'] || 0,
      totalSims: typeTotals['sim_chip'] || 0,
      totalRadios: typeTotals['radio_communication'] || 0
    };

    // 5) Alertas básicas (opcional, manteniendo signature actual)
    const alerts = [];
    if (disposalProposals > 0) {
      alerts.push({
        type: 'warning',
        message: `${disposalProposals} propuesta${disposalProposals !== 1 ? 's' : ''} de baja` ,
        time: 'ahora',
        icon: 'fas fa-exclamation-triangle'
      });
    }
    alerts.push({ type: 'success', message: 'Sistema funcionando correctamente', time: 'ahora', icon: 'fas fa-check-circle' });

    // 6) Métricas de seguridad simples (placeholder compatible)
    const security = { securityEquipment: 0, accessLogs: 0, updatedCredentials: 0, securityAlerts: 0 };

    return res.json({
      stats: { totalEquipment, activeEquipment, disposalProposals },
      equipmentByType,
      alerts,
      security
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener alertas del sistema
const getSystemAlerts = async (user) => {
  try {
    const alerts = [];

    // Alerta de propuestas de baja pendientes
    let disposalQuery = `
      SELECT COUNT(*) as count
      FROM equipment e
      WHERE e.status = 'disposed'
    `;
    params = [];

    if (user.role === 'manager') {
      disposalQuery += ' AND e.state_id = ?';
      params.push(user.state_id);
    } else if (user.role === 'consultant') {
      disposalQuery += ' AND a.user_id = ?';
      disposalQuery = disposalQuery.replace('FROM equipment e', 'FROM equipment e LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL');
      params.push(user.id);
    }

    const disposalResult = await executeQuery(disposalQuery, params);
    const disposalCount = disposalResult[0].count;

    if (disposalCount > 0) {
      alerts.push({
        type: 'warning',
        message: `${disposalCount} propuesta${disposalCount > 1 ? 's' : ''} de baja pendiente${disposalCount > 1 ? 's' : ''} de aprobación`,
        time: 'hace 4 horas',
        icon: 'fas fa-exclamation-triangle'
      });
    }

    // Alerta de sistema funcionando correctamente
    alerts.push({
      type: 'success',
      message: 'Sistema funcionando correctamente',
      time: 'hace 0 minutos',
      icon: 'fas fa-check-circle'
    });

    return alerts;

  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return [];
  }
};

// Obtener métricas de seguridad
const getSecurityMetrics = async (user) => {
  try {
    let whereConditions = [];
    let params = [];

    if (user.role === 'manager') {
      whereConditions.push('e.state_id = ?');
      params.push(user.state_id);
    } else if (user.role === 'consultant') {
      whereConditions.push('a.user_id = ?');
      params.push(user.id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Equipos de seguridad
    const securityQuery = `
      SELECT COUNT(*) as security_equipment
      FROM equipment e
      ${user.role === 'consultant' ? 'LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL' : ''}
      ${whereClause}
      AND e.type IN ('server', 'router', 'switch')
    `;

    const securityResult = await executeQuery(securityQuery, params);

    // Logs de acceso (simulado)
    const accessLogs = 12;
    const updatedCredentials = 3;
    const securityAlerts = 0;

    return {
      securityEquipment: securityResult[0].security_equipment || 0,
      accessLogs: accessLogs,
      updatedCredentials: updatedCredentials,
      securityAlerts: securityAlerts
    };

  } catch (error) {
    console.error('Error al obtener métricas de seguridad:', error);
    return {
      securityEquipment: 0,
      accessLogs: 0,
      updatedCredentials: 0,
      securityAlerts: 0
    };
  }
};

// Obtener estadísticas detalladas por tipo de equipo
const getEquipmentTypeStats = async (req, res) => {
  try {
    let whereConditions = [];
    let params = [];

    if (req.user.role === 'manager') {
      whereConditions.push('e.state_id = ?');
      params.push(req.user.state_id);
    } else if (req.user.role === 'consultant') {
      whereConditions.push('a.user_id = ?');
      params.push(req.user.id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        type,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'out_of_service' THEN 1 ELSE 0 END) as out_of_service,
        SUM(CASE WHEN status = 'disposed' THEN 1 ELSE 0 END) as disposed
      FROM equipment e
      ${req.user.role === 'consultant' ? 'LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL' : ''}
      ${whereClause}
      GROUP BY type
      ORDER BY total DESC
    `;

    const stats = await executeQuery(query, params);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas por tipo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener gráficos del dashboard
const getDashboardCharts = async (req, res) => {
  try {
    // Para pruebas, usar datos simulados
    const mockChartData = {
      success: true,
      data: {
        typeChart: [
          { type: 'desktop', count: 8 },
          { type: 'laptop', count: 6 },
          { type: 'printer', count: 4 },
          { type: 'server', count: 3 },
          { type: 'router', count: 2 },
          { type: 'switch', count: 2 }
        ],
        stateChart: [
          { status: 'active', count: 20 },
          { status: 'out_of_service', count: 2 },
          { status: 'disposed', count: 0 }
        ],
        locationChart: [
          { location: 'Oficina Central', count: 12 },
          { location: 'Sucursal Norte', count: 6 },
          { location: 'Sucursal Sur', count: 4 },
          { location: 'Almacén', count: 3 }
        ]
      }
    };

    res.json(mockChartData);

  } catch (error) {
    console.error('Error al obtener gráficos del dashboard:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getDashboardStats,
  getEquipmentTypeStats,
  getDashboardCharts
}; 
