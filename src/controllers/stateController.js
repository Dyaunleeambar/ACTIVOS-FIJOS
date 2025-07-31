const { executeQuery } = require('../config/database');

// Obtener todos los estados
const getAllStates = async (req, res) => {
  try {
    const query = `
      SELECT id, name, code, is_active, created_at, updated_at
      FROM states 
      WHERE is_active = 1
      ORDER BY name ASC
    `;
    
    const states = await executeQuery(query);
    
    res.json({
      success: true,
      data: states
    });
    
  } catch (error) {
    console.error('Error al obtener estados:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener un estado por ID
const getStateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, name, code, is_active, created_at, updated_at
      FROM states 
      WHERE id = ? AND is_active = 1
    `;
    
    const states = await executeQuery(query, [id]);
    
    if (states.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Estado no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: states[0]
    });
    
  } catch (error) {
    console.error('Error al obtener estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Crear nuevo estado
const createState = async (req, res) => {
  try {
    const { name, code } = req.body;
    
    // Validaciones
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        error: 'Nombre y código son requeridos'
      });
    }
    
    // Verificar si el código ya existe
    const checkQuery = 'SELECT id FROM states WHERE code = ?';
    const existingStates = await executeQuery(checkQuery, [code]);
    
    if (existingStates.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El código de estado ya existe'
      });
    }
    
    // Insertar nuevo estado
    const insertQuery = `
      INSERT INTO states (name, code) 
      VALUES (?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [name, code]);
    
    // Obtener el estado creado
    const newStateQuery = 'SELECT * FROM states WHERE id = ?';
    const newStates = await executeQuery(newStateQuery, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newStates[0],
      message: 'Estado creado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al crear estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar estado
const updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, is_active } = req.body;
    
    // Verificar si el estado existe
    const checkQuery = 'SELECT id FROM states WHERE id = ?';
    const existingStates = await executeQuery(checkQuery, [id]);
    
    if (existingStates.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Estado no encontrado'
      });
    }
    
    // Verificar si el código ya existe en otro estado
    if (code) {
      const codeCheckQuery = 'SELECT id FROM states WHERE code = ? AND id != ?';
      const codeStates = await executeQuery(codeCheckQuery, [code, id]);
      
      if (codeStates.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'El código de estado ya existe'
        });
      }
    }
    
    // Actualizar estado
    const updateQuery = `
      UPDATE states 
      SET name = COALESCE(?, name), 
          code = COALESCE(?, code), 
          is_active = COALESCE(?, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [name, code, is_active, id]);
    
    // Obtener el estado actualizado
    const updatedStateQuery = 'SELECT * FROM states WHERE id = ?';
    const updatedStates = await executeQuery(updatedStateQuery, [id]);
    
    res.json({
      success: true,
      data: updatedStates[0],
      message: 'Estado actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar estado (soft delete)
const deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el estado existe
    const checkQuery = 'SELECT id FROM states WHERE id = ?';
    const existingStates = await executeQuery(checkQuery, [id]);
    
    if (existingStates.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Estado no encontrado'
      });
    }
    
    // Soft delete - marcar como inactivo
    const deleteQuery = `
      UPDATE states 
      SET is_active = 0, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await executeQuery(deleteQuery, [id]);
    
    res.json({
      success: true,
      message: 'Estado eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllStates,
  getStateById,
  createState,
  updateState,
  deleteState
}; 