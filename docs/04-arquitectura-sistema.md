# Arquitectura del Sistema - Sistema de Gestión de Medios Informáticos

## 1. Visión General de la Arquitectura

### 1.1 Patrón Arquitectónico
El sistema sigue una arquitectura **cliente-servidor** con separación de responsabilidades:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Base de       │
│   (Cliente)     │◄──►│   (Servidor)    │◄──►│   Datos         │
│                 │    │                 │    │                 │
│ HTML/CSS/JS     │    │ Node.js/Express │    │ MySQL           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js con Express.js
- **Base de Datos**: MySQL
- **Comunicación**: RESTful API
- **Autenticación**: JWT (JSON Web Tokens)

## 2. Arquitectura Detallada

### 2.1 Capa de Presentación (Frontend)
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Login     │  │  Dashboard  │  │  Reports    │       │
│  │   Page      │  │   Page      │  │   Page      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Inventory  │  │ Assignment  │  │  Security   │       │
│  │   Page      │  │   Page      │  │   Page      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

**Características:**
- Interfaz responsive y moderna
- Navegación intuitiva
- Validación de formularios en cliente
- Manejo de estados de carga y errores

### 2.2 Capa de Aplicación (Backend)
```
┌─────────────────────────────────────────────────────────────┐
│                   Backend Layer                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Routes    │  │ Controllers │  │  Services   │       │
│  │             │  │             │  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Middleware  │  │ Validation  │  │  Utils      │       │
│  │             │  │             │  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- **Routes**: Definición de endpoints de la API
- **Controllers**: Lógica de manejo de requests
- **Services**: Lógica de negocio
- **Middleware**: Autenticación, validación, logging
- **Utils**: Funciones auxiliares

### 2.3 Capa de Datos
```
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Models    │  │  Database   │  │  Migrations │       │
│  │             │  │   Schema    │  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  Queries    │  │  Indexes    │  │  Backups    │       │
│  │             │  │             │  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- **Models**: Representación de entidades de negocio
- **Database Schema**: Estructura de tablas y relaciones
- **Migrations**: Control de versiones de la base de datos
- **Queries**: Consultas optimizadas
- **Indexes**: Optimización de rendimiento

## 3. Modelo de Datos

### 3.1 Entidades Principales

#### Usuarios (Users)
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'consultant') NOT NULL,
    state_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Estados (States)
```sql
CREATE TABLE states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### Equipos (Equipment)
```sql
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventory_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'radio_communication', 'sim_chip', 'roaming', 'other') NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    specifications TEXT,
    status ENUM('active', 'maintenance', 'out_of_service', 'disposed') DEFAULT 'active',
    state_id INT,
    assigned_to INT,
    location_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

#### Asignaciones (Assignments)
```sql
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);
```

#### Movimientos (Movements)
```sql
CREATE TABLE movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    from_state_id INT,
    to_state_id INT NOT NULL,
    from_location TEXT,
    to_location TEXT,
    moved_by INT NOT NULL,
    moved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (from_state_id) REFERENCES states(id),
    FOREIGN KEY (to_state_id) REFERENCES states(id),
    FOREIGN KEY (moved_by) REFERENCES users(id)
);
```

#### Datos de Seguridad (Security Data)
```sql
CREATE TABLE security_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    username VARCHAR(100),
    password VARCHAR(255),
    access_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);
```

#### Propuestas de Baja (Disposal Proposals)
```sql
CREATE TABLE disposal_proposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    proposed_by INT NOT NULL,
    reason ENUM('damage', 'obsolescence', 'loss') NOT NULL,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (proposed_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

## 4. API RESTful

### 4.1 Estructura de Endpoints

#### Autenticación
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
```

#### Usuarios
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

#### Equipos
```
GET    /api/equipment
GET    /api/equipment/:id
POST   /api/equipment
PUT    /api/equipment/:id
DELETE /api/equipment/:id
GET    /api/equipment/state/:stateId
```

#### Asignaciones
```
GET    /api/assignments
GET    /api/assignments/:id
POST   /api/assignments
PUT    /api/assignments/:id
DELETE /api/assignments/:id
```

#### Reportes
```
GET    /api/reports/inventory
GET    /api/reports/movements
GET    /api/reports/equipment-by-employee
GET    /api/reports/equipment-by-type
GET    /api/reports/equipment-by-state
GET    /api/reports/disposals
```

### 4.2 Autenticación y Autorización

#### JWT Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 1,
    "username": "admin",
    "role": "admin",
    "stateId": 1,
    "iat": 1516239022,
    "exp": 1516242622
  }
}
```

#### Roles y Permisos
- **admin**: Acceso completo a todas las funcionalidades (IT Central)
- **manager**: Gestión de equipos en su estado (Responsables de Medios)
- **consultant**: Solo consulta de información (Consultores)

## 5. Seguridad

### 5.1 Medidas de Seguridad
- **Autenticación**: JWT tokens
- **Autorización**: Control de acceso basado en roles
- **Encriptación**: Passwords hasheados con bcrypt
- **Validación**: Sanitización de inputs
- **HTTPS**: Comunicación encriptada
- **Rate Limiting**: Protección contra ataques de fuerza bruta

### 5.2 Configuración de Seguridad
```javascript
// Middleware de seguridad
app.use(helmet()); // Headers de seguridad
app.use(cors()); // Configuración CORS
app.use(rateLimit()); // Rate limiting
app.use(express.json({ limit: '10mb' })); // Límite de tamaño
```

## 6. Escalabilidad

### 6.1 Estrategias de Escalabilidad
- **Horizontal**: Múltiples instancias del servidor
- **Vertical**: Optimización de recursos del servidor
- **Base de Datos**: Índices optimizados, consultas eficientes
- **Caché**: Redis para datos frecuentemente accedidos

### 6.2 Optimizaciones de Rendimiento
- **Lazy Loading**: Carga progresiva de datos
- **Pagination**: Paginación en listas grandes
- **Compression**: Compresión gzip
- **CDN**: Servir archivos estáticos desde CDN

## 7. Monitoreo y Logging

### 7.1 Logging
```javascript
// Configuración de logging
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 7.2 Métricas de Monitoreo
- **Performance**: Tiempo de respuesta de API
- **Errors**: Tasa de errores y tipos
- **Usage**: Uso de recursos del servidor
- **Business**: Métricas de negocio (equipos activos, asignaciones, etc.)

## 8. Componentes Específicos del Sistema

### 8.1 Módulo de Gestión de Inventario
```
┌─────────────────────────────────────────────────────────────┐
│                Inventory Management Module                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Equipment   │  │ Equipment   │  │ Equipment   │       │
│  │ Registration│  │ Status      │  │ Movement    │       │
│  │ Controller  │  │ Controller  │  │ Controller  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Equipment   │  │ Equipment   │  │ Equipment   │       │
│  │ Service     │  │ Repository  │  │ Validator   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Módulo de Gestión de Asignaciones
```
┌─────────────────────────────────────────────────────────────┐
│                Assignment Management Module                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Assignment  │  │ Assignment  │  │ Assignment  │       │
│  │ Controller  │  │ History     │  │ Transfer    │       │
│  │             │  │ Controller  │  │ Controller  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Assignment  │  │ Assignment  │  │ Assignment  │       │
│  │ Service     │  │ Repository  │  │ Validator   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Módulo de Control de Seguridad
```
┌─────────────────────────────────────────────────────────────┐
│                Security Control Module                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Security    │  │ Security    │  │ Security    │       │
│  │ Data        │  │ Access      │  │ Credentials │       │
│  │ Controller  │  │ Controller  │  │ Controller  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Security    │  │ Security    │  │ Security    │       │
│  │ Service     │  │ Repository  │  │ Encryptor   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 8.4 Módulo de Reportes
```
┌─────────────────────────────────────────────────────────────┐
│                    Reports Module                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Inventory   │  │ Movement    │  │ Equipment   │       │
│  │ Reports     │  │ Reports     │  │ Reports     │       │
│  │ Controller  │  │ Controller  │  │ Controller  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Reports     │  │ PDF         │  │ Excel       │       │
│  │ Service     │  │ Generator   │  │ Generator   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 8.5 Módulo de Propuestas de Baja
```
┌─────────────────────────────────────────────────────────────┐
│                Disposal Proposals Module                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Disposal    │  │ Disposal    │  │ Disposal    │       │
│  │ Proposal    │  │ Approval    │  │ Report      │       │
│  │ Controller  │  │ Controller  │  │ Controller  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Disposal    │  │ Disposal    │  │ Checklist   │       │
│  │ Service     │  │ Repository  │  │ Generator   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 9. Interfaces y APIs Detalladas

### 9.1 API de Equipos
```javascript
// GET /api/equipment
// Obtener lista de equipos con filtros
{
  "filters": {
    "state_id": 1,
    "type": "desktop",
    "status": "active"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  }
}

// POST /api/equipment
// Crear nuevo equipo
{
  "inventory_number": "INV-2024-001",
  "name": "PC Oficina Central",
  "type": "desktop",
  "brand": "Dell",
  "model": "OptiPlex 7090",
  "specifications": "Intel i7, 16GB RAM, 512GB SSD",
  "state_id": 1,
  "security_data": {
    "username": "admin",
    "password": "encrypted_password",
    "access_details": "Windows 11 Pro"
  }
}
```

### 9.2 API de Asignaciones
```javascript
// POST /api/assignments
// Asignar equipo a empleado
{
  "equipment_id": 1,
  "user_id": 5,
  "assigned_by": 1,
  "notes": "Asignación para trabajo remoto"
}

// GET /api/assignments/history/:equipment_id
// Obtener historial de asignaciones de un equipo
{
  "assignments": [
    {
      "id": 1,
      "equipment_id": 1,
      "user_id": 5,
      "assigned_by": 1,
      "assigned_at": "2024-01-15T10:30:00Z",
      "returned_at": null,
      "notes": "Asignación actual"
    }
  ]
}
```

### 9.3 API de Reportes
```javascript
// GET /api/reports/inventory/state/:stateId
// Reporte de inventario por estado
{
  "state_id": 1,
  "total_equipment": 25,
  "by_type": {
    "desktop": 10,
    "laptop": 8,
    "printer": 3,
    "other": 4
  },
  "by_status": {
    "active": 20,
    "maintenance": 3,
    "out_of_service": 2
  },
  "equipment_list": [...]
}

// GET /api/reports/equipment-by-employee
// Reporte de equipos por empleado
{
  "employee_id": 5,
  "employee_name": "Juan Pérez",
  "assigned_equipment": [
    {
      "id": 1,
      "name": "PC Oficina Central",
      "type": "desktop",
      "assigned_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 10. Despliegue

### 10.1 Arquitectura de Despliegue
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Server    │    │   Database      │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (MySQL)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 10.2 Configuración de Producción
- **Servidor**: Ubuntu 20.04 LTS
- **Web Server**: Nginx como reverse proxy
- **Process Manager**: PM2 para Node.js
- **Database**: MySQL 8.0
- **SSL**: Certificado Let's Encrypt

---

*Documento de Arquitectura del Sistema - Versión 2.0 (Validada)* 