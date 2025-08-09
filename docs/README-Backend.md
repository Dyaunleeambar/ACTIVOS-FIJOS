# Backend - Sistema de Gestión de Medios Informáticos

## 🚀 **Configuración Inicial**

### **1. Instalación de Dependencias**
```bash
npm install
```

### **2. Configuración de Variables de Entorno**
Copia el archivo de ejemplo y configura tus variables:
```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sistema_gestion_medios
DB_PORT=3306

# Configuración de JWT
JWT_SECRET=tu-super-secret-jwt-key

# Configuración del Frontend
FRONTEND_URL=http://localhost:3000
```

### **3. Inicialización de la Base de Datos**
```bash
npm run init-db
```

Este comando:
- ✅ Crea la base de datos si no existe
- ✅ Crea todas las tablas necesarias
- ✅ Inserta datos de ejemplo
- ✅ Crea usuario administrador (admin/admin123)

## 🏗️ **Estructura del Proyecto**

```
src/
├── config/           # Configuración de base de datos
├── controllers/      # Controladores de la API
├── middleware/       # Middleware de autenticación y validación
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── models/          # Modelos de datos
├── utils/           # Utilidades
└── server.js        # Archivo principal del servidor
```

## 🔐 **Autenticación y Autorización**

### **Roles de Usuario:**
- **admin**: Acceso completo a todas las funcionalidades
- **manager**: Gestión de equipos en su estado asignado
- **consultant**: Solo consulta de equipos asignados

### **JWT Token:**
El sistema utiliza JWT para autenticación. Los tokens incluyen:
- `userId`: ID del usuario
- `username`: Nombre de usuario
- `role`: Rol del usuario
- `stateId`: ID del estado (para managers)

## 📡 **APIs Implementadas**

### **Autenticación**
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/profile` - Obtener perfil del usuario
- `POST /api/auth/change-password` - Cambiar password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar token

### **Equipos**
- `GET /api/equipment` - Obtener todos los equipos
- `GET /api/equipment/:id` - Obtener equipo por ID
- `POST /api/equipment` - Crear nuevo equipo
- `PUT /api/equipment/:id` - Actualizar equipo
- `DELETE /api/equipment/:id` - Eliminar equipo
- `GET /api/equipment/state/:stateId` - Equipos por estado

### **Dashboard**
- `GET /api/dashboard/stats` - Estadísticas generales para dashboard
- `GET /api/dashboard/equipment-type-stats` - Estadísticas por tipo de equipo
- `GET /api/dashboard/charts` - Datos de gráficos del dashboard
- `GET /api/dashboard/recent-activity` - Actividad reciente en el sistema

### **Gestión de Estados**
- `GET /api/states` - Listar todos los estados
- `GET /api/states/:id` - Obtener estado por ID
- `POST /api/states` - Crear nuevo estado (solo admin)
- `PUT /api/states/:id` - Actualizar estado (solo admin)
- `DELETE /api/states/:id` - Eliminar estado (solo admin)

## 🛠️ Troubleshooting de Endpoints y Ejemplos

Si experimentas problemas con los endpoints recientes (dashboard, estados):
- Verifica que el token JWT sea válido y tenga permisos adecuados.
- Usa herramientas como Postman o curl para probar los endpoints:

```bash
# Obtener estadísticas del dashboard
curl -X GET http://localhost:3000/api/dashboard/stats -H "Authorization: Bearer <tu-token-jwt>"

# Obtener todos los estados
curl -X GET http://localhost:3000/api/states

# Crear nuevo estado (requiere token admin)
curl -X POST http://localhost:3000/api/states \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Nueva Región", "code": "NRG"}'
```

Si recibes error 401/403:
- Asegúrate de usar un token válido y que el usuario tenga el rol adecuado.

Si recibes error 500:
- Consulta los logs del backend (`logs/error.log`) para detalles.

## 🔧 **Comandos Disponibles**

### **Desarrollo**
```bash
# Iniciar servidor en modo desarrollo
npm run dev

# Inicializar base de datos
npm run init-db

# Iniciar servidor en producción
npm start
```

### **Documentación**
```bash
# Convertir documentación a PDF
npm run convert-docs

# Convertir documento específico
npm run convert-single <archivo.md>
```

## 🗄️ **Base de Datos**

### **Tablas Principales:**
- **users**: Usuarios del sistema
- **states**: Estados geográficos
- **equipment**: Equipos informáticos
- **assignments**: Asignaciones de equipos
- **movements**: Movimientos de equipos
- **security_data**: Datos de seguridad
- **disposal_proposals**: Propuestas de baja

### **Datos de Ejemplo:**
El script de inicialización crea:
- 6 estados (Capital + 5 estados)
- Usuario administrador (admin/admin123)
- 4 usuarios de ejemplo (managers y consultants)
- 5 equipos de ejemplo

## 🔒 **Seguridad**

### **Medidas Implementadas:**
- ✅ **JWT Authentication**: Tokens seguros
- ✅ **Password Hashing**: bcrypt para contraseñas
- ✅ **Role-based Authorization**: Control de acceso por roles
- ✅ **Input Validation**: Validación de datos de entrada
- ✅ **Rate Limiting**: Protección contra ataques
- ✅ **CORS Configuration**: Configuración de CORS
- ✅ **Helmet**: Headers de seguridad

### **Validaciones:**
- ✅ Validación de tipos de datos
- ✅ Validación de formatos
- ✅ Validación de permisos por rol
- ✅ Validación de acceso por estado (managers)

## 📊 **Logging**

### **Archivos de Log:**
- `logs/combined.log` - Todos los logs
- `logs/error.log` - Solo errores
- `logs/database.log` - Logs de base de datos

### **Niveles de Log:**
- **info**: Información general
- **error**: Errores del sistema
- **warn**: Advertencias

## 🚀 **Despliegue**

### **Requisitos del Servidor:**
- Node.js 18+ o 22+
- MySQL 8.0+
- Nginx (opcional, para producción)

### **Variables de Producción:**
```env
NODE_ENV=production
JWT_SECRET=super-secret-key-change-this
DB_PASSWORD=strong-database-password
```

## 🧪 **Pruebas**

### **Endpoints de Prueba:**
- `GET /health` - Verificar estado del servidor
- `GET /api/auth/verify` - Verificar token

### **Datos de Prueba:**
- **Admin**: username: `admin`, password: `admin123`
- **Manager**: username: `manager1`, password: `manager123`
- **Consultant**: username: `consultant1`, password: `consultant123`

## 📝 **Ejemplos de Uso**

### **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### **Obtener Equipos:**
```bash
curl -X GET http://localhost:3000/api/equipment \
  -H "Authorization: Bearer <tu-token-jwt>"
```

### **Crear Equipo:**
```bash
curl -X POST http://localhost:3000/api/equipment \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "inventory_number": "INV-2024-006",
    "name": "Nuevo PC",
    "type": "desktop",
    "brand": "Dell",
    "model": "OptiPlex 7090",
    "specifications": "Intel i7, 16GB RAM",
    "state_id": 1
  }'
```

## 🔄 **Próximos Pasos**

### **Funcionalidades Pendientes:**
- [ ] Controladores de asignaciones
- [ ] Controladores de movimientos
- [ ] Controladores de seguridad
- [ ] Controladores de reportes
- [ ] Controladores de propuestas de baja
- [ ] Rutas adicionales
- [ ] Pruebas unitarias
- [ ] Documentación de APIs

---

*Backend - Sistema de Gestión de Medios Informáticos - Versión 1.0* 