const mysql = require('mysql2/promise');
const winston = require('winston');

// Configuración de logging para base de datos
const dbLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/database.log' })
  ]
});

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_gestion_medios',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectionLimit: 10,
  queueLimit: 0,
  // Configuraciones adicionales para mayor compatibilidad
  multipleStatements: true,
  dateStrings: true
};

// Pool de conexiones
let pool;

// Función para crear el pool de conexiones
const createPool = () => {
  try {
    pool = mysql.createPool(dbConfig);
    dbLogger.info('Pool de conexiones a MySQL creado exitosamente');
    return pool;
  } catch (error) {
    dbLogger.error('Error al crear pool de conexiones:', error);
    throw error;
  }
};

// Función para obtener una conexión del pool
const getConnection = async () => {
  try {
    if (!pool) {
      pool = createPool();
    }
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    dbLogger.error('Error al obtener conexión:', error);
    throw error;
  }
};

// Función para ejecutar queries
const executeQuery = async (query, params = []) => {
  let connection;
  try {
    connection = await getConnection();
    
    // Asegurar que los parámetros sean del tipo correcto
    const processedParams = params.map(param => {
      if (param === undefined || param === null) {
        return null;
      }
      if (typeof param === 'number') {
        // Asegurar que los números sean enteros válidos para LIMIT y OFFSET
        const num = parseInt(param);
        return isNaN(num) ? 0 : num;
      }
      if (typeof param === 'string') {
        const trimmed = param.trim();
        if (trimmed === '') {
          return null;
        }
        // NO convertir strings a números automáticamente
        // Solo mantener el string tal como está
        return trimmed;
      }
      return param;
    });
    
    console.log('🔍 executeQuery - Query:', query);
    console.log('🔍 executeQuery - Parámetros originales:', params);
    console.log('🔍 executeQuery - Parámetros procesados:', processedParams);
    
    // Usar connection.query() en lugar de connection.execute() para evitar problemas con parámetros
    const [results] = await connection.query(query, processedParams);
    return results;
  } catch (error) {
    dbLogger.error('Error al ejecutar query:', { query, params, error: error.message });
    console.error('❌ Error en executeQuery:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Función para ejecutar transacciones
const executeTransaction = async (queries) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.query(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    dbLogger.error('Error en transacción:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Función para verificar la conexión
const testConnection = async () => {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    dbLogger.info('Conexión a MySQL verificada exitosamente');
    return true;
  } catch (error) {
    dbLogger.error('Error al verificar conexión:', error);
    return false;
  }
};

// Función para cerrar el pool
const closePool = async () => {
  if (pool) {
    await pool.end();
    dbLogger.info('Pool de conexiones cerrado');
  }
};

module.exports = {
  createPool,
  getConnection,
  executeQuery,
  executeTransaction,
  testConnection,
  closePool,
  pool
}; 
