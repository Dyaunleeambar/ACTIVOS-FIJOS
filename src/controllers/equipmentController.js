const { executeQuery } = require('../config/database-sqlite');
const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Obtener todos los equipos con filtros
const getAllEquipment = async (req, res) => {
  try {
    const { state_id, type, status, search, page = 1, limit = 20 } = req.query;
    
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

    // Agregar búsqueda
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions.push(`(
        e.inventory_number LIKE ? OR 
        e.name LIKE ? OR 
        e.brand LIKE ? OR 
        e.model LIKE ? OR
        e.assigned_to LIKE ?
      )`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
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
        e.location_details,
        e.created_at,
        e.updated_at,
        s.name as state_name
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
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

    // Validación de campos obligatorios
    const requiredFields = {
      inventory_number: 'Número de inventario',
      name: 'Nombre del equipo',
      type: 'Tipo',
      brand: 'Marca',
      model: 'Modelo',
      status: 'Estado',
      state_id: 'Estado/Región',
      assigned_to: 'Responsable del equipo'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      const value = req.body[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      console.log('❌ createEquipment - Campos obligatorios faltantes:', missingFields);
      return res.status(400).json({
        error: `Campos obligatorios faltantes: ${missingFields.join(', ')}`
      });
    }

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
      inventory_number, name, type, brand, model, specifications || null,
      status, state_id, assigned_to, location_details || null
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
    const {
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
    } = req.body;

    console.log('🔍 updateEquipment - Datos recibidos:', {
      id,
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

    // Verificar que el equipo existe
    const existingQuery = 'SELECT id, inventory_number, name, assigned_to FROM equipment WHERE id = ?';
    const existing = await executeQuery(existingQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Equipo no encontrado'
      });
    }

    // Validación de campos obligatorios
    const requiredFields = {
      inventory_number: 'Número de inventario',
      name: 'Nombre del equipo',
      type: 'Tipo',
      brand: 'Marca',
      model: 'Modelo',
      status: 'Estado',
      state_id: 'Estado/Región',
      assigned_to: 'Responsable del equipo'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      const value = req.body[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      console.log('❌ updateEquipment - Campos obligatorios faltantes:', missingFields);
      return res.status(400).json({
        error: `Campos obligatorios faltantes: ${missingFields.join(', ')}`
      });
    }

    // Verificar que el número de inventario sea único (excluyendo el equipo actual)
    const checkQuery = 'SELECT id FROM equipment WHERE inventory_number = ? AND id != ?';
    const duplicate = await executeQuery(checkQuery, [inventory_number, id]);

    if (duplicate.length > 0) {
      console.log('❌ updateEquipment - Número de inventario ya existe:', inventory_number);
      return res.status(400).json({
        error: 'El número de inventario ya existe'
      });
    }

    // Actualizar equipo
    const updateQuery = `
      UPDATE equipment SET 
        inventory_number = ?, 
        name = ?, 
        type = ?, 
        brand = ?, 
        model = ?, 
        specifications = ?,
        status = ?, 
        state_id = ?, 
        assigned_to = ?, 
        location_details = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      inventory_number, name, type, brand, model, specifications || null,
      status, state_id, assigned_to, location_details || null, id
    ];

    console.log('🔍 updateEquipment - Query de actualización:', updateQuery);
    console.log('🔍 updateEquipment - Parámetros de actualización:', params);

    await executeQuery(updateQuery, params);

    console.log(`✅ updateEquipment - Equipo ${id} actualizado correctamente`);

    // Obtener el equipo actualizado
    const updatedEquipment = await executeQuery('SELECT * FROM equipment WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Equipo actualizado correctamente',
      equipment: updatedEquipment[0]
    });

  } catch (error) {
    console.error('❌ Error al actualizar equipo:', error);
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
    const existingQuery = 'SELECT id, inventory_number, name, assigned_to FROM equipment WHERE id = ?';
    const existing = await executeQuery(existingQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        error: 'Equipo no encontrado'
      });
    }

    const equipment = existing[0];

    // Verificar que el equipo no esté asignado actualmente (OPCIONAL - Comentado para permitir eliminación)
    // if (equipment.assigned_to && equipment.assigned_to.trim() !== '') {
    //   return res.status(400).json({
    //     error: `No se puede eliminar el equipo "${equipment.name}" porque está asignado a: ${equipment.assigned_to}`
    //   });
    // }

    // Eliminar equipo
    await executeQuery('DELETE FROM equipment WHERE id = ?', [id]);

    res.json({
      message: `Equipo "${equipment.name}" (${equipment.inventory_number}) eliminado exitosamente`
    });

  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de equipos por tipo
const getEquipmentStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        type,
        COUNT(*) as total
      FROM equipment
      GROUP BY type
    `;

    const stats = await executeQuery(query);

    // Convertir a formato esperado por el frontend
    const formattedStats = {
      laptops: 0,
      pcs: 0,
      monitors: 0,
      printers: 0,
      sims: 0,
      radios: 0
    };

    stats.forEach(stat => {
      switch (stat.type) {
        case 'laptop':
          formattedStats.laptops = stat.total;
          break;
        case 'desktop':
          formattedStats.pcs = stat.total;
          break;
        case 'printer':
          formattedStats.printers = stat.total;
          break;
        case 'sim_chip':
          formattedStats.sims = stat.total;
          break;
        case 'radio_communication':
          formattedStats.radios = stat.total;
          break;
        default:
          // Para otros tipos, asignar a pcs como fallback
          formattedStats.pcs += stat.total;
          break;
      }
    });

    res.json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de equipos:', error);
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
        s.name as state_name
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
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
    console.log('🚀 Iniciando uploadExcel...');
    console.log('📊 Headers:', req.headers);
    console.log('📋 Content-Type:', req.headers['content-type']);
    console.log('📁 Archivo recibido:', req.file);

    if (!req.file) {
      console.error('❌ No se proporcionó archivo');
      return res.status(400).json({
        error: 'No se proporcionó ningún archivo'
      });
    }

    try {
      // Leer el archivo Excel
      console.log('📖 Leyendo archivo Excel:', req.file.path);
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log('📊 Datos leídos:', data.length, 'filas');

      if (data.length < 2) {
        return res.status(400).json({
          error: 'El archivo Excel debe contener al menos una fila de datos'
        });
      }

      // Obtener columnas (primera fila)
      const columns = data[0];
      const rows = data.slice(1);

      console.log('📋 Columnas encontradas:', columns);
      console.log('📊 Filas de datos:', rows.length);

      // Limpiar archivo temporal
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Archivo temporal eliminado');
      }

      res.json({
        success: true,
        data: {
          columns: columns,
          data: rows,
          totalRows: rows.length
        }
      });

    } catch (excelError) {
      console.error('❌ Error procesando Excel:', excelError);
      
      // Limpiar archivo temporal en caso de error
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        error: 'Error al procesar el archivo Excel. Verifique que sea un archivo válido.'
      });
    }
  } catch (error) {
    console.error('❌ Error general en uploadExcel:', error);
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
    console.log('🚀 Iniciando confirmación de importación...');
    console.log('📊 Datos recibidos:', { mapping: req.body.mapping, dataLength: req.body.data?.length, validation: req.body.validation });
    
    const { mapping, data, validation } = req.body;

    if (!mapping || !data || !validation) {
      console.error('❌ Datos faltantes:', { mapping: !!mapping, data: !!data, validation: !!validation });
      return res.status(400).json({
        error: 'Datos de mapeo, datos y validación son requeridos'
      });
    }

    let imported = 0;
    let duplicates = 0;
    let errors = 0;

    console.log('📋 Procesando', data.length, 'filas de datos...');

    // Procesar cada fila válida
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        console.log(`📝 Procesando fila ${i + 1}:`, row);
        
        const mappedData = {};

        // Mapear datos según el mapping
        Object.keys(mapping).forEach(field => {
          const columnIndex = mapping[field];
          if (columnIndex !== undefined && columnIndex < row.length) {
            mappedData[field] = row[columnIndex];
          }
        });

        console.log('🗺️ Datos mapeados:', mappedData);

        // Verificar si el número de inventario ya existe
        const existingQuery = 'SELECT id FROM equipment WHERE inventory_number = ?';
        const existing = await executeQuery(existingQuery, [mappedData.inventory_number]);

        if (existing.length > 0) {
          console.log('⚠️ Duplicado encontrado:', mappedData.inventory_number);
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

        const insertParams = [
          mappedData.inventory_number,
          mappedData.name,
          mappedData.type,
          mappedData.brand || null,
          mappedData.model || null,
          mappedData.specifications || null,
          mappedData.status,
          mappedData.state_id,
          mappedData.assigned_to || null
        ];

        console.log('💾 Insertando equipo:', insertParams);
        await executeQuery(insertQuery, insertParams);
        console.log('✅ Equipo insertado exitosamente');

        imported++;

      } catch (error) {
        console.error(`❌ Error al importar fila ${i + 1}:`, error);
        errors++;
      }
    }

    console.log('📊 Resultados de importación:', { imported, duplicates, errors, total: data.length });

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
    console.error('❌ Error al confirmar importación:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// Exportar a Excel
const exportToExcel = async (req, res) => {
  try {
    console.log('🚀 Iniciando exportación a Excel...');
    console.log('📊 Query parameters:', req.query);
    console.log('🔍 Headers:', req.headers);
    
    const { state_id, type, status, search } = req.query;

    console.log('📋 Parámetros extraídos:', { state_id, type, status, search });

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
    
    console.log('🔍 Where clause:', whereClause);
    console.log('📊 Parámetros de consulta:', params);

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
        e.assigned_to,
        e.created_at
      FROM equipment e
      LEFT JOIN states s ON e.state_id = s.id
      ${whereClause}
      ORDER BY e.created_at DESC
    `;

    console.log('📝 Query final:', query);

    const equipment = await executeQuery(query, params);
    
    console.log('✅ Equipos encontrados:', equipment.length);

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
      'Asignado a': item.assigned_to || '',
      'Fecha de Creación': item.created_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos');

    // Generar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Configurar headers para descarga
    const filename = `equipos-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    console.log('📦 Generando archivo Excel:', filename);
    console.log('📏 Tamaño del buffer:', buffer.length);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
    
    console.log('✅ Exportación completada exitosamente');

  } catch (error) {
    console.error('❌ Error al exportar equipos:', error);
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

// Función temporal para listar equipos con asignaciones
const getAssignedEquipment = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        inventory_number,
        name,
        type,
        assigned_to,
        status
      FROM equipment 
      WHERE assigned_to IS NOT NULL AND assigned_to != ''
      ORDER BY id ASC
    `;
    
    const equipment = await executeQuery(query);
    
    res.json({
      success: true,
      data: equipment,
      count: equipment.length
    });
    
  } catch (error) {
    console.error('Error al obtener equipos asignados:', error);
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
  downloadTemplate,
  getEquipmentStats,
  getAssignedEquipment
}; 
