const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos SQLite
const dbPath = path.join(__dirname, '../../data/sistema_gestion_medios.db');

// Crear conexión a SQLite
const createConnection = () => {
    return new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('❌ Error conectando a SQLite:', err.message);
        } else {
            console.log('✅ Conectado a la base de datos SQLite');
        }
    });
};

// Función para ejecutar queries
const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        const db = createConnection();
        
        console.log('🔍 executeQuery - Query:', query);
        console.log('🔍 executeQuery - Parámetros:', params);
        
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('❌ Error en executeQuery:', err);
                reject(err);
            } else {
                console.log('✅ executeQuery - Resultados:', rows.length);
                resolve(rows);
            }
            db.close();
        });
    });
};

// Función para ejecutar queries de inserción/actualización
const executeUpdate = (query, params = []) => {
    return new Promise((resolve, reject) => {
        const db = createConnection();
        
        console.log('🔍 executeUpdate - Query:', query);
        console.log('🔍 executeUpdate - Parámetros:', params);
        
        db.run(query, params, function(err) {
            if (err) {
                console.error('❌ Error en executeUpdate:', err);
                reject(err);
            } else {
                console.log('✅ executeUpdate - Filas afectadas:', this.changes);
                resolve({ changes: this.changes, lastID: this.lastID });
            }
            db.close();
        });
    });
};

// Inicializar base de datos
const initializeDatabase = async () => {
    try {
        const db = createConnection();
        
        // Crear tablas
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                // Tabla de estados
                db.run(`
                    CREATE TABLE IF NOT EXISTS states (
                        id INTEGER PRIMARY KEY,
                        name TEXT NOT NULL
                    )
                `);
                
                // Tabla de usuarios
                db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY,
                        username TEXT UNIQUE NOT NULL,
                        email TEXT,
                        full_name TEXT NOT NULL,
                        password TEXT NOT NULL,
                        role TEXT NOT NULL,
                        state_id INTEGER,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (state_id) REFERENCES states (id)
                    )
                `);
                
                // Tabla de equipos
                db.run(`
                    CREATE TABLE IF NOT EXISTS equipment (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        inventory_number TEXT UNIQUE NOT NULL,
                        name TEXT NOT NULL,
                        type TEXT NOT NULL,
                        brand TEXT,
                        model TEXT,
                        specifications TEXT,
                        status TEXT DEFAULT 'active',
                        state_id INTEGER,
                        assigned_to TEXT,
                        location_details TEXT,
                        security_username TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (state_id) REFERENCES states (id)
                    )
                `);
                
                db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
        
        console.log('✅ Base de datos SQLite inicializada');
        
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        throw error;
    }
};

// Insertar datos de prueba
const insertTestData = async () => {
    try {
        console.log('🚀 Insertando datos de prueba...');
        
        // Insertar estados
        const states = [
            { id: 1, name: 'Dirección' },
            { id: 2, name: 'Capital' },
            { id: 3, name: 'Carabobo' },
            { id: 4, name: 'Barinas' },
            { id: 5, name: 'Anzoátegui' },
            { id: 6, name: 'Bolívar' },
            { id: 7, name: 'Zulia' }
        ];
        
        for (const state of states) {
            await executeUpdate(
                'INSERT OR IGNORE INTO states (id, name) VALUES (?, ?)',
                [state.id, state.name]
            );
        }
        
        // Insertar usuario de prueba (password: admin123)
        await executeUpdate(
            'INSERT OR IGNORE INTO users (id, username, email, full_name, password, role, state_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [1, 'admin', 'admin@test.com', 'Administrador', 'admin123', 'admin', 1]
        );
        
        // Insertar equipos de prueba
        const equipment = [
            {
                inventory_number: 'INV001',
                name: 'Laptop Dell XPS 13',
                type: 'laptop',
                brand: 'Dell',
                model: 'XPS 13',
                status: 'active',
                state_id: 1
            },
            {
                inventory_number: 'INV002',
                name: 'Desktop HP EliteDesk',
                type: 'desktop',
                brand: 'HP',
                model: 'EliteDesk 800',
                status: 'active',
                state_id: 2
            },
            {
                inventory_number: 'INV003',
                name: 'Impresora HP LaserJet',
                type: 'printer',
                brand: 'HP',
                model: 'LaserJet Pro',
                status: 'maintenance',
                state_id: 3
            }
        ];
        
        for (const item of equipment) {
            await executeUpdate(
                'INSERT OR IGNORE INTO equipment (inventory_number, name, type, brand, model, status, state_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [item.inventory_number, item.name, item.type, item.brand, item.model, item.status, item.state_id]
            );
        }
        
        console.log('✅ Datos de prueba insertados correctamente');
        
    } catch (error) {
        console.error('❌ Error insertando datos de prueba:', error);
        throw error;
    }
};

module.exports = {
    executeQuery,
    executeUpdate,
    initializeDatabase,
    insertTestData
}; 
