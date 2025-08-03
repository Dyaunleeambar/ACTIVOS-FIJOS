const { executeQuery } = require('../config/database');
const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Obtener todos los equipos con filtros
const getAllEquipment = async (req, res) => {
  try {
    const { state_id, type, status, page = 1, limit = 20 } = req.query;
    
    // Convertir y validar parámetros de paginación
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const offset = (pageNum - 1) * limitNum;

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
        s.name as state_name
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
      ${req.user.role === 'consultant' ? 'LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL' : ''}
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Debug: mostrar valores recibidos
    console.log('🔍 getAllEquipment - Valores recibidos:', { page, limit });
    console.log('🔍 getAllEquipment - Valores procesados:', { pageNum, limitNum, offset });
    console.log('🔍 getAllEquipment - Tipos de parámetros:', { 
      pageNumType: typeof pageNum, 
      limitNumType: typeof limitNum, 
      offsetType: typeof offset 
    });
    
    // Agregar los parámetros de paginación al final
    const finalParams = [...params, limitNum, offset];
    console.log('🔍 getAllEquipment - Parámetros finales:', finalParams);
    console.log('🔍 getAllEquipment - Tipos de parámetros finales:', finalParams.map(p => typeof p));

    const equipment = await executeQuery(query, finalParams);

    // Obtener total de registros para paginación
    const countQuery = `
      SELECT COUNT(*) as total
      FROM equipment e
      ${req.user.role === 'consultant' ? 'LEFT JOIN assignments a ON e.id = a.equipment_id AND a.returned_at IS NULL' : ''}
      ${whereClause}
    `;

    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;

    // Calcular información de paginación
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      equipment,
      pagination: {
        currentPage: pageNum,
        totalPages,
        total,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Error en getAllEquipment:', error);
    res.status(500).json({
      success: false,
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
      status = 'active',
      state_id,
      assigned_to,
      location_details
    } = req.body;

    console.log('🔍 createEquipment - Datos recibidos:', {
      inventory_number,
      name,
      type,
      brand,
      model,
      specifications,
      status,
      state_id,
      assigned_to,
      location_details
    });

    // Verificar que el número de inventario sea único
    const checkQuery = 'SELECT id FROM equipment WHERE inventory_number = ?';
    console.log('🔍 createEquipment - Query de validación:', checkQuery);
    console.log('🔍 createEquipment - Parámetro de validación:', [inventory_number]);
    
    const existing = await executeQuery(checkQuery, [inventory_number]);
    
    console.log('🔍 createEquipment - Resultado de validación:', existing);

    if (existing.length > 0) {
      console.log('❌ createEquipment - Número de inventario ya existe:', inventory_number);
      return res.status(400).json({
        error: 'El número de inventario ya existe'
      });
    }

    console.log('✅ createEquipment - Número de inventario válido, procediendo con inserción');

    // Insertar nuevo equipo
    const insertQuery = `
      INSERT INTO equipment (
        inventory_number, name, type, brand, model, specifications,
        status, state_id, assigned_to, location_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Filtrar valores undefined y convertirlos a null
    const params = [
      inventory_number, name, type, brand || null, model || null, specifications || null,
      status, state_id, assigned_to || null, location_details || null
    ];

    console.log('🔍 createEquipment - Query de inserción:', insertQuery);
    console.log('🔍 createEquipment - Parámetros de inserción:', params);

    const result = await executeQuery(insertQuery, params);

    console.log('✅ createEquipment - Equipo insertado, ID:', result.insertId);

    // Obtener el equipo creado
    const newEquipment = await executeQuery('SELECT * FROM equipment WHERE id = ?', [result.insertId]);

    console.log('✅ createEquipment - Equipo creado exitosamente:', newEquipment[0]);

    res.status(201).json({
      message: 'Equipo creado exitosamente',
      equipment: newEquipment[0]
    });

  } catch (error) {
    console.error('❌ Error al crear equipo:', error);
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

// Subir archivo Excel
const uploadExcel = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'No se proporcionó ningún archivo'
        });
      }

      // Leer el archivo Excel
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length < 2) {
        return res.status(400).json({
          error: 'El archivo Excel debe contener al menos una fila de datos'
        });
      }

      // Obtener columnas (primera fila)
      const columns = data[0];
      const rows = data.slice(1);

      // Limpiar archivo temporal
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        data: {
          columns: columns,
          data: rows,
          totalRows: rows.length
        }
      });

    });
  } catch (error) {
    console.error('Error al procesar archivo Excel:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Validar datos de importación
const validateImport = async (req, res) => {
  try {
    const { mapping, data } = req.body;

    if (!mapping || !data) {
      return res.status(400).json({
        error: 'Datos de mapeo y datos son requeridos'
      });
    }

    const errors = [];
    const validRows = [];
    const requiredFields = ['inventory_number', 'name', 'type', 'status', 'state_id'];

    // Validar cada fila
    data.forEach((row, index) => {
      const rowErrors = [];
      const mappedData = {};

      // Mapear datos según el mapping
      Object.keys(mapping).forEach(field => {
        const columnIndex = mapping[field];
        if (columnIndex !== undefined && columnIndex < row.length) {
          mappedData[field] = row[columnIndex];
        }
      });

      // Validar campos requeridos
      requiredFields.forEach(field => {
        if (!mappedData[field] || mappedData[field].toString().trim() === '') {
          rowErrors.push(`Campo requerido faltante: ${field}`);
        }
      });

      // Validar número de inventario único
      if (mappedData.inventory_number) {
        // Aquí se podría verificar en la base de datos si ya existe
        // Por ahora solo validamos que no esté vacío
      }

      // Validar tipo de equipo
      const validTypes = ['desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'radio_communication', 'sim_chip', 'roaming', 'other'];
      if (mappedData.type && !validTypes.includes(mappedData.type.toLowerCase())) {
        rowErrors.push(`Tipo de equipo inválido: ${mappedData.type}`);
      }

      // Validar estado
      const validStatuses = ['active', 'maintenance', 'out_of_service', 'disposed'];
      if (mappedData.status && !validStatuses.includes(mappedData.status.toLowerCase())) {
        rowErrors.push(`Estado inválido: ${mappedData.status}`);
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: index + 2, // +2 porque Excel empieza en 1 y la primera fila son headers
          errors: rowErrors,
          data: mappedData
        });
      } else {
        validRows.push(mappedData);
      }
    });

    res.json({
      success: true,
      data: {
        valid: validRows.length,
        errors: errors.length,
        total: data.length,
        errorDetails: errors
      }
    });

  } catch (error) {
    console.error('Error al validar datos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Confirmar importación
const confirmImport = async (req, res) => {
  try {
    const { mapping, data, validation } = req.body;

    if (!mapping || !data || !validation) {
      return res.status(400).json({
        error: 'Datos de mapeo, datos y validación son requeridos'
      });
    }

    let imported = 0;
    let duplicates = 0;
    let errors = 0;

    // Procesar cada fila válida
    for (const row of data) {
      try {
        const mappedData = {};

        // Mapear datos según el mapping
        Object.keys(mapping).forEach(field => {
          const columnIndex = mapping[field];
          if (columnIndex !== undefined && columnIndex < row.length) {
            mappedData[field] = row[columnIndex];
          }
        });

        // Verificar si el número de inventario ya existe
        const existingQuery = 'SELECT id FROM equipment WHERE inventory_number = ?';
        const existing = await executeQuery(existingQuery, [mappedData.inventory_number]);

        if (existing.length > 0) {
          duplicates++;
          continue;
        }

        // Insertar equipo
        const insertQuery = `
          INSERT INTO equipment (
            inventory_number, name, type, brand, model, specifications,
            status, state_id, assigned_to
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await executeQuery(insertQuery, [
          mappedData.inventory_number,
          mappedData.name,
          mappedData.type,
          mappedData.brand || null,
          mappedData.model || null,
          mappedData.specifications || null,
          mappedData.status,
          mappedData.state_id,
          mappedData.assigned_to || null
        ]);

        imported++;

      } catch (error) {
        console.error('Error al importar fila:', error);
        errors++;
      }
    }

    res.json({
      success: true,
      data: {
        imported,
        duplicates,
        errors,
        total: data.length
      }
    });

  } catch (error) {
    console.error('Error al confirmar importación:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Exportar a Excel
const exportToExcel = async (req, res) => {
  try {
    const { state_id, type, status, search } = req.query;

    // Construir query con filtros
    let whereConditions = [];
    let params = [];

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

    if (search) {
      whereConditions.push('(e.inventory_number LIKE ? OR e.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        e.inventory_number,
        e.name,
        e.type,
        e.brand,
        e.model,
        e.specifications,
        e.status,
        s.name as state_name,
        u.full_name as assigned_user_name,
        e.created_at
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
      LEFT JOIN users u ON e.assigned_to = u.id
      ${whereClause}
      ORDER BY e.created_at DESC
    `;

    const equipment = await executeQuery(query, params);

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    
    // Preparar datos para Excel
    const excelData = equipment.map(item => ({
      'Número de Inventario': item.inventory_number,
      'Nombre del Equipo': item.name,
      'Tipo': item.type,
      'Marca': item.brand || '',
      'Modelo': item.model || '',
      'Especificaciones': item.specifications || '',
      'Estado': item.status,
      'Estado/Región': item.state_name || '',
      'Asignado a': item.assigned_user_name || '',
      'Fecha de Creación': item.created_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos');

    // Generar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Configurar headers para descarga
    const filename = `equipos-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);

  } catch (error) {
    console.error('Error al exportar equipos:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Descargar plantilla Excel
const downloadTemplate = async (req, res) => {
  try {
    // Crear workbook con plantilla
    const workbook = XLSX.utils.book_new();
    
    // Datos de ejemplo
    const templateData = [
      {
        'Número de Inventario': 'INV-001',
        'Nombre del Equipo': 'Laptop Dell Latitude',
        'Tipo': 'laptop',
        'Marca': 'Dell',
        'Modelo': 'Latitude 5520',
        'Especificaciones': 'Intel i5, 8GB RAM, 256GB SSD',
        'Estado': 'active',
        'Estado/Región': 'Estado 1',
        'Asignado a': 'Juan Pérez'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');

    // Generar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="plantilla-equipos.xlsx"');
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);

  } catch (error) {
    console.error('Error al generar plantilla:', error);
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
  getEquipmentByState,
  uploadExcel,
  validateImport,
  confirmImport,
  exportToExcel,
  downloadTemplate
}; 
