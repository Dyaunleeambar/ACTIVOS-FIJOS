# Especificaciones Técnicas - Sistema de Gestión de Medios Informáticos

## 1. Especificaciones del Sistema

### 1.1 Requisitos Mínimos del Servidor

#### Servidor de Aplicación
- **Sistema Operativo**: Ubuntu 20.04 LTS o superior
- **Procesador**: 2 cores mínimo, 4 cores recomendado
- **Memoria RAM**: 4GB mínimo, 8GB recomendado
- **Almacenamiento**: 50GB mínimo (SSD recomendado)
- **Red**: Conexión estable a internet

#### Base de Datos
- **MySQL**: Versión 8.0 o superior
- **Almacenamiento**: 20GB mínimo para datos
- **Backup**: Espacio adicional para respaldos

### 1.2 Requisitos del Cliente
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: Habilitado
- **Resolución**: Mínimo 1024x768, recomendado 1920x1080
- **Conexión**: Internet estable

## 2. Stack Tecnológico

### 2.1 Frontend
```javascript
// Tecnologías principales
- HTML5 (Semántico y accesible)
- CSS3 (Flexbox, Grid, Variables CSS)
- JavaScript ES6+ (Vanilla, sin frameworks)

// Librerías auxiliares
- Chart.js (para gráficos)
- SweetAlert2 (para alertas)
- Axios (para peticiones HTTP)
- Moment.js (para manejo de fechas)
```

### 2.2 Backend
```javascript
// Framework principal
- Node.js 16.x o superior
- Express.js 4.x

// Middleware esencial
- cors (Cross-Origin Resource Sharing)
- helmet (Seguridad de headers)
- express-rate-limit (Rate limiting)
- express-validator (Validación de datos)
- bcryptjs (Encriptación de passwords)
- jsonwebtoken (JWT tokens)

// Base de datos
- mysql2 (Driver MySQL)
- sequelize (ORM opcional)

// Utilidades
- winston (Logging)
- multer (Upload de archivos)
- nodemailer (Envío de emails)
```

### 2.3 Base de Datos
```sql
-- Sistema de gestión de base de datos
- MySQL 8.0 o superior

-- Configuración recomendada
- InnoDB como motor de almacenamiento
- UTF-8 como codificación de caracteres
- Configuración de índices optimizada
- Backup automático configurado
```

## 3. Estructura del Proyecto

### 3.1 Estructura de Directorios
```
proyecto-activos-fijos/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   ├── tests/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── docs/
├── scripts/
└── README.md
```

### 3.2 Configuración de Entorno
```javascript
// Configuración de variables de entorno
const config = {
  development: {
    port: 3000,
    database: {
      host: 'localhost',
      port: 3306,
      name: 'activos_fijos_dev',
      user: 'dev_user',
      password: 'dev_password'
    },
    jwt: {
      secret: 'dev_secret_key',
      expiresIn: '24h'
    }
  },
  production: {
    port: process.env.PORT || 3000,
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    }
  }
};
```

## 4. API Endpoints Detallados

### 4.1 Autenticación
```javascript
// POST /api/auth/login
{
  "username": "string",
  "password": "string"
}

// Response
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "stateId": 1
  }
}
```

### 4.2 Gestión de Equipos
```javascript
// GET /api/equipment
// Query parameters: page, limit, state, status, type
{
  "success": true,
  "data": [
    {
      "id": 1,
      "inventory_number": "INV-001",
      "name": "Laptop Dell",
      "type": "laptop",
      "brand": "Dell",
      "model": "Latitude 5520",
      "status": "active",
      "state_id": 1,
      "assigned_to": 5,
      "purchase_cost": 1200.00,
      "current_value": 800.00
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}

// POST /api/equipment
{
  "inventory_number": "INV-002",
  "name": "Desktop HP",
  "type": "desktop",
  "brand": "HP",
  "model": "ProDesk 600",
  "specifications": "Intel i5, 8GB RAM, 256GB SSD",
  "purchase_date": "2023-01-15",
  "purchase_cost": 800.00,
  "state_id": 1,
  "location_details": "Oficina principal"
}
```

### 4.3 Gestión de Asignaciones
```javascript
// POST /api/assignments
{
  "equipment_id": 1,
  "user_id": 5,
  "notes": "Asignación para trabajo remoto"
}

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "equipment_id": 1,
    "user_id": 5,
    "assigned_by": 1,
    "assigned_at": "2024-01-15T10:30:00Z",
    "notes": "Asignación para trabajo remoto"
  }
}
```

### 4.4 Reportes
```javascript
// GET /api/reports/inventory?state=1&format=pdf
{
  "success": true,
  "data": {
    "total_equipment": 150,
    "active_equipment": 120,
    "maintenance_equipment": 20,
    "out_of_service": 10,
    "by_type": {
      "desktop": 50,
      "laptop": 40,
      "printer": 30,
      "server": 5,
      "other": 25
    },
    "by_state": {
      "1": 30,
      "2": 25,
      "3": 35,
      "4": 30,
      "5": 30
    }
  }
}
```

## 5. Validaciones y Reglas de Negocio

### 5.1 Validaciones de Equipos
```javascript
// Reglas de validación
const equipmentValidation = {
  inventory_number: {
    required: true,
    unique: true,
    pattern: /^INV-\d{3,}$/,
    message: "Número de inventario debe seguir el formato INV-XXX"
  },
  name: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  type: {
    required: true,
    enum: ['desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'other']
  },
  purchase_cost: {
    required: true,
    min: 0,
    type: 'number'
  },
  state_id: {
    required: true,
    exists: 'states'
  }
};
```

### 5.2 Reglas de Negocio
```javascript
// Cálculo automático de depreciación
const calculateDepreciation = (purchaseCost, purchaseDate) => {
  const years = (new Date() - new Date(purchaseDate)) / (1000 * 60 * 60 * 24 * 365);
  const depreciationRate = 0.2; // 20% anual
  const depreciation = purchaseCost * depreciationRate * years;
  return Math.max(purchaseCost - depreciation, 0);
};

// Validación de asignaciones
const validateAssignment = (equipmentId, userId) => {
  // Verificar que el equipo esté activo
  // Verificar que el usuario esté activo
  // Verificar que no esté ya asignado
  // Verificar permisos del usuario
};
```

## 6. Configuración de Seguridad

### 6.1 Middleware de Seguridad
```javascript
// Configuración de helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas peticiones desde esta IP'
});
app.use('/api/', limiter);
```

### 6.2 Encriptación y Hashing
```javascript
// Hashing de passwords
const bcrypt = require('bcryptjs');
const saltRounds = 12;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generación de JWT
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      stateId: user.state_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
```

## 7. Optimización de Rendimiento

### 7.1 Optimización de Base de Datos
```sql
-- Índices recomendados
CREATE INDEX idx_equipment_state ON equipment(state_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_equipment_assigned ON equipment(assigned_to);
CREATE INDEX idx_assignments_equipment ON assignments(equipment_id);
CREATE INDEX idx_assignments_user ON assignments(user_id);
CREATE INDEX idx_movements_equipment ON movements(equipment_id);
CREATE INDEX idx_movements_date ON movements(moved_at);

-- Consultas optimizadas
SELECT e.*, u.full_name as assigned_to_name, s.name as state_name
FROM equipment e
LEFT JOIN users u ON e.assigned_to = u.id
LEFT JOIN states s ON e.state_id = s.id
WHERE e.state_id = ? AND e.status = 'active'
ORDER BY e.inventory_number
LIMIT ? OFFSET ?;
```

### 7.2 Caché y Compresión
```javascript
// Configuración de compresión
const compression = require('compression');
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
}));

// Caché de archivos estáticos
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));
```

## 8. Monitoreo y Logging

### 8.1 Configuración de Logging
```javascript
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'activos-fijos-api' },
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 8.2 Métricas de Rendimiento
```javascript
// Middleware para métricas
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
});
```

## 9. Configuración de Despliegue

### 9.1 Scripts de Despliegue
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cp -r frontend/public/* dist/",
    "build:backend": "cp -r backend/src dist/backend && cp backend/package.json dist/",
    "deploy": "npm run build && pm2 start ecosystem.config.js"
  }
}
```

### 9.2 Configuración de PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'activos-fijos-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

---

*Documento de Especificaciones Técnicas - Versión 1.0* 