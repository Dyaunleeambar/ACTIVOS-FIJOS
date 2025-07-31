const { executeQuery } = require('../config/database');

// Obtener todos los equipos con filtros
const getAllEquipment = async (req, res) => {
  try {
    const { state_id, type, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    // Aplicar filtros según el rol del usuario
    if (req.user.role === 'manager') {
      whereConditions.push('e.state_id = ?');
      params.push(req.user.state_id);
    } else if (req.user.role === 'consultant') {
      whereConditions.push('a.user_id = ?');
      params.push(req.user.id);
    }

    if (state_id) {
      whereConditions.push('e.state_id = ?');
      params.push(state_id);
    }

    if (type) {
      whereConditions.push('e.type = ?');
      params.push(type);
    }

    if (status) {
      whereConditions.push('e.status = ?');
      params.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query principal
    const query = `
      SELECT 
        e.id,
        e.inventory_number,
        e.name,
        e.type,
        e.brand,
        e.model,
        e.specifications,
        e.status,
        e.state_id,
        e.assigned_to,
        e.location_details,
        e.created_at,
        e.updated_at,
        s.name as state_name,
        u.full_name as assigned_user_name,
        u.username as assigned_username
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
      LEFT JOIN users u ON e.assigned_to = u.id
      ${req.user.role === 'consultant' ? 'LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL' : ''}
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(parseInt(limit), offset);

    const equipment = await executeQuery(query, params);

    // Obtener total de registros para paginación
    const countQuery = `
      SELECT COUNT(*) as total
      FROM equipment e
      ${req.user.role === 'consultant' ? 'LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL' : ''}
      ${whereClause}
    `;

    const countResult = await executeQuery(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      equipment,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener un equipo por ID
const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        e.id,
        e.inventory_number,
        e.name,
        e.type,
        e.brand,
        e.model,
        e.specifications,
        e.status,
        e.state_id,
        e.assigned_to,
        e.location_details,
        e.created_at,
        e.updated_at,
        s.name as state_name,
        u.full_name as assigned_user_name,
        u.username as assigned_username
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
      LEFT JOIN users u ON e.assigned_to = u.id
      WHERE e.id = ?
    `;

    const equipment = await executeQuery(query, [id]);

    if (equipment.length === 0) {
      return res.status(404).json({
        error: 'Equipo no encontrado'
      });
    }

    res.json({
      equipment: equipment[0]
    });

  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Crear nuevo equipo
const createEquipment = async (req, res) => {
  try {
    const {
      inventory_number,
      name,
      type,
      brand,
      model,
      specifications,
      state_id,
      assigned_to,
      location_details
    } = req.body;

    // Verificar que el número de inventario sea único
    const checkQuery = 'SELECT id FROM equipment WHERE inventory_number = ?';
    const existing = await executeQuery(checkQuery, [inventory_number]);

    if (existing.length > 0) {
      return res.status(400).json({
        error: 'El número de inventario ya existe'
      });
    }

    // Insertar nuevo equipo
    const insertQuery = `
      INSERT INTO equipment (
        inventory_number, name, type, brand, model, specifications,
        state_id, assigned_to, location_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(insertQuery, [
      inventory_number, name, type, brand, model, specifications,
      state_id, assigned_to, location_details
    ]);

    // Obtener el equipo creado
    const newEquipment = await executeQuery('SELECT * FROM equipment WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Equipo creado exitosamente',
      equipment: newEquipment[0]
    });

  } catch (error) {
    console.error('Error al crear equipo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar equipo
const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que el equipo existe
    const existingQuery = 'SELECT id FROM equipment WHERE id = ?';
    const existing = await executeQuery(existingQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Equipo no encontrado'
      });
    }

    // Si se está actualizando el número de inventario, verificar que sea único
    if (updateData.inventory_number) {
      const checkQuery = 'SELECT id FROM equipment WHERE inventory_number = ? AND id != ?';
      const duplicate = await executeQuery(checkQuery, [updateData.inventory_number, id]);

      if (duplicate.length > 0) {
        return res.status(400).json({
          error: 'El número de inventario ya existe'
        });
      }
    }

    // Construir query de actualización dinámicamente
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        error: 'No hay datos para actualizar'
      });
    }

    values.push(id);

    const updateQuery = `UPDATE equipment SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(updateQuery, values);

    // Obtener el equipo actualizado
    const updatedEquipment = await executeQuery('SELECT * FROM equipment WHERE id = ?', [id]);

    res.json({
      message: 'Equipo actualizado exitosamente',
      equipment: updatedEquipment[0]
    });

  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar equipo
const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el equipo existe
    const existingQuery = 'SELECT id FROM equipment WHERE id = ?';
    const existing = await executeQuery(existingQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Equipo no encontrado'
      });
    }

    // Verificar que no tenga asignaciones activas
    const assignmentQuery = 'SELECT id FROM assignments WHERE equipment_id = ? AND returned_at IS NULL';
    const assignments = await executeQuery(assignmentQuery, [id]);

    if (assignments.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar un equipo que tiene asignaciones activas'
      });
    }

    // Eliminar equipo
    await executeQuery('DELETE FROM equipment WHERE id = ?', [id]);

    res.json({
      message: 'Equipo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener equipos por estado
const getEquipmentByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const { type, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = ['e.state_id = ?'];
    let params = [stateId];

    if (type) {
      whereConditions.push('e.type = ?');
      params.push(type);
    }

    if (status) {
      whereConditions.push('e.status = ?');
      params.push(status);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const query = `
      SELECT 
        e.id,
        e.inventory_number,
        e.name,
        e.type,
        e.brand,
        e.model,
        e.specifications,
        e.status,
        e.state_id,
        e.assigned_to,
        e.location_details,
        e.created_at,
        e.updated_at,
        s.name as state_name,
        u.full_name as assigned_user_name,
        u.username as assigned_username
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
      LEFT JOIN users u ON e.assigned_to = u.id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(parseInt(limit), offset);

    const equipment = await executeQuery(query, params);

    // Obtener total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM equipment e
      ${whereClause}
    `;

    const countResult = await executeQuery(countQuery, params.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      equipment,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener equipos por estado:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentByState
}; 