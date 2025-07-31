# Sistema de Gestión de Medios Informáticos

Sistema web para la gestión de activos informáticos de una empresa de servicios electroenergéticos.

## 🚀 Características

- **Gestión de Equipos**: CRUD completo de equipos informáticos
- **Dashboard Interactivo**: Estadísticas y métricas en tiempo real
- **Sistema de Autenticación**: JWT con roles de usuario
- **Interfaz Moderna**: Diseño responsive y flotante
- **Reportes**: Generación de informes y estadísticas
- **Gestión de Asignaciones**: Control de asignación de equipos
- **Propuestas de Baja**: Gestión de bajas de equipos

## 🛠️ Tecnologías

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome para iconos
- Chart.js para gráficos
- Inter font family

### Backend
- Node.js con Express.js
- MySQL/SQLite para base de datos
- JWT para autenticación
- Helmet para seguridad
- Winston para logging

### Herramientas
- Nodemon para desarrollo
- Puppeteer para conversión PDF
- Multer para manejo de archivos

## 📋 Requisitos

- Node.js (v14 o superior)
- MySQL o SQLite
- NPM o Yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/sistema-gestion-medios-informaticos.git
cd sistema-gestion-medios-informaticos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```
Editar el archivo `.env` con tus configuraciones:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu-password
DB_NAME=sistema_gestion_medios
JWT_SECRET=tu-secret-key
```

4. **Inicializar la base de datos**
```bash
npm run init-db
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📁 Estructura del Proyecto

```
├── public/                 # Frontend estático
│   ├── css/               # Estilos CSS
│   ├── js/                # JavaScript del cliente
│   └── index.html         # Página principal
├── src/                   # Backend
│   ├── config/            # Configuración
│   ├── controllers/       # Controladores
│   ├── middleware/        # Middleware
│   ├── models/           # Modelos de datos
│   ├── routes/           # Rutas de la API
│   ├── services/         # Servicios
│   └── server.js         # Servidor principal
├── docs/                 # Documentación
├── scripts/              # Scripts de utilidad
└── templates/            # Plantillas
```

## 🎯 Funcionalidades Principales

### Dashboard
- Estadísticas de equipos por estado
- Gráficos de distribución por tipo
- Actividad reciente
- Métricas de rendimiento

### Gestión de Equipos
- Registro de nuevos equipos
- Edición y actualización
- Filtros avanzados
- Búsqueda por múltiples criterios

### Sistema de Usuarios
- Autenticación JWT
- Roles de usuario (Admin, Manager, Consultor)
- Gestión de permisos

### Reportes
- Generación de informes PDF
- Estadísticas detalladas
- Exportación de datos

## 🔐 Seguridad

- Autenticación JWT
- Helmet para headers de seguridad
- Rate limiting
- Validación de datos
- Sanitización de inputs

## 📱 Responsive Design

- Diseño adaptativo para móviles
- Sidebar flotante
- Interfaz optimizada para touch

## 🚀 Scripts Disponibles

```bash
npm start          # Iniciar servidor de producción
npm run dev        # Iniciar servidor de desarrollo
npm run init-db    # Inicializar base de datos
npm run convert-docs # Convertir documentación a PDF
```

## 📊 Base de Datos

El sistema soporta tanto MySQL como SQLite:

### MySQL
```sql
CREATE DATABASE sistema_gestion_medios;
```

### SQLite
Se crea automáticamente en `database.sqlite`

## 🔧 Configuración de Desarrollo

1. **Variables de entorno para desarrollo**
```env
NODE_ENV=development
PORT=3000
DB_TYPE=sqlite
```

2. **Instalar dependencias de desarrollo**
```bash
npm install --save-dev nodemon
```

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Equipos
- `GET /api/equipment` - Listar equipos
- `POST /api/equipment` - Crear equipo
- `PUT /api/equipment/:id` - Actualizar equipo
- `DELETE /api/equipment/:id` - Eliminar equipo

### Estados
- `GET /api/states` - Listar estados

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **IT Department** - *Desarrollo inicial*

## 🙏 Agradecimientos

- Font Awesome por los iconos
- Chart.js por las gráficas
- Express.js por el framework
- La comunidad de Node.js

## 📞 Soporte

Para soporte técnico, contactar al departamento de IT.

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024 
