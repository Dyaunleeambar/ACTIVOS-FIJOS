const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const equipmentRoutes = require('./routes/equipment');
const stateRoutes = require('./routes/stateRoutes');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

// Importar middleware
const { authenticateToken } = require('./middleware/auth');

// Importar inicialización de base de datos
const { initializeDatabase } = require('./config/init-database');
const { updateDatabase } = require('./config/update-database');
const { checkDatabase } = require('./config/check-database');

// Importar SQLite temporalmente
const { initializeDatabase: initSQLite, insertTestData } = require('./config/database-sqlite');

// Crear aplicación Express
const app = express();

// Configuración de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            // Permitir atributos inline (onclick, etc.) para UI generada dinámicamente en escritorio
            scriptSrcAttr: ["'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"]
        }
    }
}));

// Configuración de CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'http://127.0.0.1:5501',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 requests por ventana
    message: {
        error: 'Demasiadas requests desde esta IP, intente nuevamente en 15 minutos'
    }
});
app.use('/api/', limiter);

// Middleware para parsing de JSON (excluir rutas de archivos)
app.use((req, res, next) => {
    // No procesar JSON para rutas que manejan archivos
    if (req.path.includes('/upload-excel') || req.path.includes('/upload')) {
        return next();
    }
    
    // Para otras rutas, usar el middleware de JSON
    express.json({ limit: '10mb' })(req, res, next);
});

app.use((req, res, next) => {
    // No procesar URL encoded para rutas que manejan archivos
    if (req.path.includes('/upload-excel') || req.path.includes('/upload')) {
        return next();
    }
    
    // Para otras rutas, usar el middleware de URL encoded
    express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

// Middleware para manejar archivos (multer) - REMOVIDO DE AQUÍ
// Se manejará en las rutas específicas

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente', timestamp: new Date().toISOString() });
});

// Endpoint de prueba para upload
app.post('/api/test-upload', (req, res) => {
    console.log('🧪 Test upload - Headers:', req.headers);
    console.log('🧪 Test upload - Body type:', typeof req.body);
    console.log('🧪 Test upload - Body:', req.body);
    res.json({ 
        message: 'Test upload funcionando',
        bodyType: typeof req.body,
        hasBody: !!req.body,
        headers: req.headers
    });
});

// Endpoint de prueba para exportación (sin autenticación)
app.get('/api/test-export', async (req, res) => {
    try {
        console.log('🧪 Test export - Query parameters:', req.query);
        
        const { executeQuery } = require('./config/database-sqlite');
        
        // Query simple para probar
        const query = `
            SELECT 
                inventory_number,
                name,
                type,
                status,
                created_at
            FROM equipment 
            LIMIT 5
        `;
        
        const equipment = await executeQuery(query);
        console.log('🧪 Test export - Equipos encontrados:', equipment.length);
        
        res.json({
            success: true,
            equipment: equipment,
            count: equipment.length
        });
        
    } catch (error) {
        console.error('❌ Test export error:', error);
        res.status(500).json({
            error: 'Error en test export',
            details: error.message
        });
    }
});

// Endpoint de prueba para exportación real (sin autenticación)
app.get('/api/test-export-excel', async (req, res) => {
    try {
        console.log('🧪 Test export Excel - Query parameters:', req.query);
        
        const { executeQuery } = require('./config/database-sqlite');
        const XLSX = require('xlsx');
        
        // Query simple para probar
        const query = `
            SELECT 
                inventory_number,
                name,
                type,
                status,
                created_at
            FROM equipment 
            LIMIT 5
        `;
        
        const equipment = await executeQuery(query);
        console.log('🧪 Test export Excel - Equipos encontrados:', equipment.length);
        
        // Crear workbook
        const workbook = XLSX.utils.book_new();
        
        // Preparar datos para Excel
        const excelData = equipment.map(item => ({
            'Número de Inventario': item.inventory_number,
            'Nombre del Equipo': item.name,
            'Tipo': item.type,
            'Estado': item.status,
            'Fecha de Creación': item.created_at
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipos');

        // Generar buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Configurar headers para descarga
        const filename = `test-equipos-${new Date().toISOString().split('T')[0]}.xlsx`;
        
        console.log('📦 Generando archivo Excel de prueba:', filename);
        console.log('📏 Tamaño del buffer:', buffer.length);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length);

        res.send(buffer);
        
        console.log('✅ Test export Excel completado exitosamente');
        
    } catch (error) {
        console.error('❌ Test export Excel error:', error);
        res.status(500).json({
            error: 'Error en test export Excel',
            details: error.message
        });
    }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rutas de desarrollo (sin autenticación)
app.get('/dev/equipment/assigned', async (req, res) => {
    try {
        const { executeQuery } = require('./config/database');
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
        console.error('Error al obtener equipos asignados (dev):', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/dev/equipment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;

        const { executeQuery } = require('./config/database');
        const existingQuery = 'SELECT id, inventory_number, name, assigned_to FROM equipment WHERE id = ?';
        const existing = await executeQuery(existingQuery, [id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Equipo no encontrado' });
        }

        const updateQuery = 'UPDATE equipment SET assigned_to = ? WHERE id = ?';
        await executeQuery(updateQuery, [assigned_to || null, id]);

        console.log(`✅ Equipo ${id} actualizado correctamente`);
        res.json({ success: true, message: 'Equipo actualizado correctamente' });

    } catch (error) {
        console.error('Error actualizando equipo (dev):', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint temporal para actualizar estados
app.post('/dev/update-states', async (req, res) => {
    try {
        const { executeQuery } = require('./config/database');
        
        console.log('🔄 Actualizando estados con nombres venezolanos...');

        // Limpiar estados existentes
        console.log('🗑️ Limpiando estados existentes...');
        await executeQuery('DELETE FROM states');
        await executeQuery('ALTER TABLE states AUTO_INCREMENT = 1');

        // Insertar nuevos estados venezolanos
        console.log('📝 Insertando nuevos estados venezolanos...');
        const states = [
            { name: 'Dirección', code: 'DIR' },
            { name: 'Carabobo', code: 'CAR' },
            { name: 'Anzoátegui', code: 'ANZ' },
            { name: 'Bolívar', code: 'BOL' },
            { name: 'Barinas', code: 'BAR' },
            { name: 'Zulia', code: 'ZUL' },
            { name: 'Capital', code: 'CAP' }
        ];

        for (const state of states) {
            await executeQuery(
                'INSERT INTO states (name, code) VALUES (?, ?)',
                [state.name, state.code]
            );
            console.log(`   ✅ Insertado: ${state.name} (${state.code})`);
        }

        // Verificar que se insertaron correctamente
        const insertedStates = await executeQuery('SELECT * FROM states ORDER BY name');
        console.log('\n📊 Estados actualizados:');
        insertedStates.forEach((state, index) => {
            console.log(`   ${index + 1}. ${state.name} (${state.code})`);
        });

        console.log('\n✅ Estados actualizados correctamente');
        
        res.json({ 
            success: true, 
            message: 'Estados actualizados correctamente',
            states: insertedStates
        });

    } catch (error) {
        console.error('❌ Error actualizando estados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta principal - servir la aplicación frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta específica para equipment-assigned.html
app.get('/equipment-assigned.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/equipment-assigned.html'));
});

// Ruta para todas las rutas del frontend (SPA)
app.get('*', (req, res) => {
    // Si la ruta no es de la API, servir el frontend
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    } else {
        res.status(404).json({ error: 'Endpoint no encontrado' });
    }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Puerto del servidor
const PORT = process.env.PORT || 3001;

// Función para actualizar estados
const updateStates = async () => {
  try {
    const { executeQuery } = require('./config/database');
    
    console.log('🔄 Actualizando estados con nombres venezolanos...');

    // Limpiar estados existentes
    console.log('🗑️ Limpiando estados existentes...');
    await executeQuery('DELETE FROM states');
    await executeQuery('ALTER TABLE states AUTO_INCREMENT = 1');

    // Insertar nuevos estados venezolanos
    console.log('📝 Insertando nuevos estados venezolanos...');
    const states = [
      { name: 'Dirección', code: 'DIR' },
      { name: 'Carabobo', code: 'CAR' },
      { name: 'Anzoátegui', code: 'ANZ' },
      { name: 'Bolívar', code: 'BOL' },
      { name: 'Barinas', code: 'BAR' },
      { name: 'Zulia', code: 'ZUL' },
      { name: 'Capital', code: 'CAP' }
    ];

    for (const state of states) {
      await executeQuery(
        'INSERT INTO states (name, code) VALUES (?, ?)',
        [state.name, state.code]
      );
      console.log(`   ✅ Insertado: ${state.name} (${state.code})`);
    }

    // Verificar que se insertaron correctamente
    const insertedStates = await executeQuery('SELECT * FROM states ORDER BY name');
    console.log('\n📊 Estados actualizados:');
    insertedStates.forEach((state, index) => {
      console.log(`   ${index + 1}. ${state.name} (${state.code})`);
    });

    console.log('\n✅ Estados actualizados correctamente');

  } catch (error) {
    console.error('❌ Error actualizando estados:', error);
  }
};

// Inicializar base de datos y actualizar estados
const initializeServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // Inicializar base de datos SQLite temporalmente
    console.log('🔧 Inicializando SQLite...');
    await initSQLite();
    
    // Asegurar usuario admin en SQLite para entorno de escritorio
    try {
      const { executeQuery: sqliteQuery, executeUpdate: sqliteUpdate } = require('./config/database-sqlite');
      const existingAdmin = await sqliteQuery('SELECT id FROM users WHERE username = ? LIMIT 1', ['admin']);
      if (!existingAdmin || existingAdmin.length === 0) {
        console.log('👤 Creando usuario admin por defecto en SQLite...');
        const hashed = await bcrypt.hash('admin123', 10);
        await sqliteUpdate(
          'INSERT INTO users (username, email, full_name, password, role, state_id) VALUES (?, ?, ?, ?, ?, ?)',
          ['admin', 'admin@sistema.com', 'Administrador', hashed, 'admin', 1]
        );
        console.log('✅ Usuario admin (admin/admin123) creado en SQLite');
      } else {
        console.log('✅ Usuario admin ya existe en SQLite');
      }
    } catch (e) {
      console.error('❌ Error asegurando usuario admin en SQLite:', e);
    }
    
    console.log('✅ Servidor inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando servidor:', error);
  }
};

// Llamar a la inicialización al inicio
initializeServer();

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
    console.log(`🔧 API disponible en: http://localhost:${PORT}/api`);
    console.log(`💚 Salud del servidor: http://localhost:${PORT}/health`);
    
    // Inicializar base de datos MySQL solo si no estamos en modo escritorio/SQLite
    if (!process.env.APP_DATA_DIR) {
        try {
            await updateDatabase();
            await initializeDatabase();
            
            // Configurar usuario admin si no existe (MySQL)
            const { setupAdminUser } = require('./config/setup-admin-user');
            await setupAdminUser();
            
            console.log('✅ Base de datos (MySQL) inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando base de datos MySQL:', error);
        }
    } else {
        console.log('🧩 Modo escritorio/SQLite detectado: omitiendo inicialización MySQL');
    }
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido, cerrando servidor...');
    process.exit(0);
});

module.exports = app; 
