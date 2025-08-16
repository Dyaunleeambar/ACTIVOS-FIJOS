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
- **Filtros Avanzados**: Búsqueda y filtrado inteligente
- **Importación/Exportación**: Soporte para archivos Excel
- **Notificaciones en Tiempo Real**: Sistema de alertas y confirmaciones

## 🛠️ Tecnologías

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome para iconos
- Chart.js para gráficos
- Inter font family
- Sistema de diseño desktop-first

### Backend
- Node.js con Express.js
- SQLite (por defecto, desarrollo) y MySQL (opcional/producción) para base de datos
- JWT para autenticación
- Helmet para seguridad
- Winston para logging
- Multer para manejo de archivos

### Herramientas
- Nodemon para desarrollo
- Puppeteer para conversión PDF
- XLSX para manejo de archivos Excel

## 📋 Requisitos

- Node.js (v14 o superior)
- SQLite 3 (por defecto, sin configuración) y/o MySQL 8.0+ (opcional)
- NPM o Yarn

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Dyaunleeambar/ACTIVOS-FIJOS.git
cd ACTIVOS-FIJOS
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
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu-password
DB_NAME=sistema_gestion_medios
JWT_SECRET=tu-secret-key
```

4. **Inicializar la base de datos**
```bash
npm start
```
El sistema automáticamente ejecutará las migraciones de base de datos al iniciar.

5. **Iniciar el servidor**
```bash
# Desarrollo
npm start

# El servidor estará disponible en:
# Frontend: http://localhost:3001
# API: http://localhost:3001/api
# Health Check: http://localhost:3001/health
```

## 📁 Estructura del Proyecto

```
├── public/                 # Frontend estático
│   ├── css/               # Estilos CSS
│   │   ├── design-tokens.css    # Variables CSS del sistema
│   │   ├── styles.css           # Estilos base y layout
│   │   ├── dashboard.css        # Estilos específicos del dashboard
│   │   ├── forms.css           # Estilos de formularios
│   │   ├── components.css      # Componentes reutilizables
│   │   ├── equipment.css       # Estilos específicos de equipos
│   │   └── utilities.css       # Utilidades CSS
│   ├── js/                # JavaScript del cliente
│   │   ├── config.js          # Configuración global
│   │   ├── auth.js            # Módulo de autenticación
│   │   ├── api.js             # Módulo de API
│   │   ├── ui.js              # Utilidades de UI
│   │   ├── app.js             # Aplicación principal
│   │   ├── dashboard.js       # Módulo del dashboard
│   │   ├── equipment.js       # Módulo de equipos
│   │   ├── components.js      # Componentes reutilizables
│   │   ├── accessibility.js   # Funciones de accesibilidad
│   │   └── performance.js     # Optimizaciones de performance
│   └── index.html         # Página principal
├── src/                   # Backend
│   ├── config/            # Configuración
│   │   ├── database.js        # Configuración de base de datos
│   │   ├── init-database.js   # Inicialización de BD
│   │   └── update-database.js # Migraciones de BD
│   ├── controllers/       # Controladores
│   │   ├── authController.js      # Autenticación
│   │   ├── dashboardController.js # Dashboard
│   │   ├── equipmentController.js # Equipos
│   │   └── stateController.js     # Estados
│   ├── middleware/        # Middleware
│   │   ├── auth.js            # Autenticación JWT
│   │   └── validation.js      # Validación de datos
│   ├── routes/           # Rutas de la API
│   │   ├── auth.js            # Rutas de autenticación
│   │   ├── dashboard.js       # Rutas del dashboard
│   │   ├── equipment.js       # Rutas de equipos
│   │   ├── stateRoutes.js     # Rutas de estados
│   │   └── users.js           # Rutas de usuarios
│   └── server.js         # Servidor principal
├── docs/                 # Documentación
├── scripts/              # Scripts de utilidad
├── templates/            # Plantillas
├── logs/                 # Logs del sistema
└── testing-scripts/      # Scripts de prueba
```

## 🎯 Funcionalidades Principales

### Dashboard
- Estadísticas de equipos por estado
- Gráficos de distribución por tipo
- Actividad reciente
- Métricas de rendimiento
- Actualizaciones en tiempo real

### Gestión de Equipos
- **Registro de nuevos equipos** con modal dinámico
- **Edición y actualización** con validación en tiempo real
- **Filtros avanzados** con búsqueda integrada
- **Búsqueda por múltiples criterios** (inventario, nombre, tipo, estado)
- **Eliminación con confirmación** y validación de asignaciones
- **Estados de equipos**: active, maintenance, out_of_service, disposed
- **Tipos de equipos**: desktop, laptop, printer, server, router, switch, radio_communication, sim_chip, roaming, other

### Sistema de Usuarios
- Autenticación JWT
- Roles de usuario (Admin, Manager, Consultor)
- Gestión de permisos por página
- Auto-logout por expiración

### Importación/Exportación
- **Importación desde Excel**: Soporte para archivos .xlsx y .xls
- **Exportación a Excel**: Con filtros aplicados
- **Plantilla descargable**: Para facilitar la importación
- **Validación de datos**: Verificación de campos requeridos y formatos

### Reportes y Estadísticas
- **Estadísticas en tiempo real**: Por tipo de equipo
- **Generación de informes PDF**: Con datos filtrados
- **Exportación de datos**: En formato Excel
- **Gráficos interactivos**: Con Chart.js

## 🔐 Seguridad

- Autenticación JWT con refresh tokens
- Helmet para headers de seguridad
- Rate limiting
- Validación de datos en frontend y backend
- Sanitización de inputs
- Control de acceso basado en roles (RBAC)
- Protección CSRF

## 📱 Responsive Design

- **Desktop-first approach**: Optimizado para pantallas grandes
- Diseño adaptativo para móviles y tablets
- Sidebar flotante en dispositivos móviles
- Interfaz optimizada para touch
- Breakpoints: 1024px (desktop), 1440px (large), 1920px (xl)

## 🎨 Sistema de Diseño

### Design Tokens
- **Colores**: Paleta profesional con azul primario (#3b82f6) y púrpura secundario (#a855f7)
- **Tipografía**: Inter como fuente principal
- **Espaciado**: Sistema de 8px base (0.5rem)
- **Estados**: Verde (active), Amarillo (maintenance), Rojo (out_of_service), Gris (disposed)

### Componentes
- **Modales**: Dinámicos con confirmaciones
- **Notificaciones**: Sistema de alertas en tiempo real
- **Filtros**: Compactos con chips activos
- **Tablas**: Responsivas con paginación
- **Formularios**: Validación en tiempo real

## 🚀 Scripts Disponibles

```bash
npm start          # Iniciar servidor de producción
npm run dev        # Iniciar servidor de desarrollo
npm run convert-docs   # Convertir documentación a PDF
npm run convert-single # Convertir un documento individual a PDF

# Electron
npm run electron:dev   # Ejecutar app Electron (puerto 3131)
npm run electron:build # Construir instalador para Windows

# Base de datos
npm run init-db        # Inicializar base de datos
npm run update-db      # Aplicar migraciones/actualizaciones
```

## 📊 Base de Datos

### Esquema Principal

#### Tabla `equipment`
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
  assigned_to VARCHAR(100),
  location_details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (state_id) REFERENCES states(id)
);
```

#### Tabla `users`
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'manager', 'consultant') DEFAULT 'consultant',
  state_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (state_id) REFERENCES states(id)
);
```

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Equipos
- `GET /api/equipment` - Listar equipos con paginación y filtros
- `POST /api/equipment` - Crear equipo
- `PUT /api/equipment/:id` - Actualizar equipo
- `DELETE /api/equipment/:id` - Eliminar equipo
- `GET /api/equipment/stats` - Estadísticas por tipo
- `GET /api/equipment/export` - Exportar a Excel
- `POST /api/equipment/upload-excel` - Importar desde Excel
- `GET /api/equipment/template` - Descargar plantilla

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/charts` - Datos para gráficos
- `GET /api/dashboard/equipment-type-stats` - Estadísticas por tipo

### Estados
- `GET /api/states` - Listar estados

## 🔧 Configuración de Desarrollo

### Variables de entorno para desarrollo
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu-password
DB_NAME=sistema_gestion_medios
JWT_SECRET=tu-secret-key
```

### Migraciones de Base de Datos
El sistema incluye migraciones automáticas que se ejecutan al iniciar:
- Conversión de `assigned_to` de INT a VARCHAR
- Eliminación de columnas de seguridad obsoletas
- Adición de `location_details`

## 🐛 Correcciones Implementadas

### Problemas Resueltos
1. **Error de paginación**: Corregido el manejo de parámetros en `getAllEquipment`
2. **Validación de inventario**: Solucionado el problema de "número ya existe"
3. **Endpoint de estadísticas**: Agregado `/api/equipment/stats`
4. **Funcionalidad de eliminación**: Implementada con confirmación modal
5. **Migración de base de datos**: Corregido el manejo de foreign keys
6. **Notificaciones**: Sistema mejorado con posicionamiento correcto
7. **Filtros**: Rediseño completo con búsqueda integrada

### Mejoras de UX/UI
1. **Modal de confirmación**: Botones funcionales con estilos mejorados
2. **Filtros compactos**: Diseño optimizado para desktop
3. **Notificaciones**: Posicionamiento y animaciones mejoradas
4. **Responsive design**: Desktop-first con adaptaciones móviles
5. **Accesibilidad**: Cumplimiento WCAG 2.1 AA

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

## 🛠️ Scripts de Diagnóstico y Troubleshooting

El sistema incluye scripts avanzados para diagnóstico y auto-corrección de problemas comunes en la carga inicial y filtrado de equipos. Estos scripts ayudan a identificar y solucionar errores sin intervención manual.

### Scripts disponibles
- **public/js/diagnose-initial-load.js**: Diagnóstico de problemas de carga inicial de equipos. Permite verificar el flujo de inicialización, detectar si los datos no se cargan automáticamente y sugerir acciones correctivas.
- **public/js/auto-fix-initial-load.js**: Script de auto-corrección que detecta y corrige automáticamente el problema de que no se cargan los equipos al entrar a la página.
- **public/js/diagnose-filters.js**: Herramientas para verificar la correcta inicialización de filtros, elementos del DOM y event listeners relacionados con el filtrado de equipos.
- **public/js/debug-filters.js**: Permite depurar la actualización de filtros y el correcto funcionamiento de los chips de filtros activos.

### Ejemplo de uso en consola
Puedes ejecutar funciones de diagnóstico desde la consola del navegador:

```js
// Diagnóstico de carga inicial
diagnoseInitialLoad();

// Forzar carga inicial
diagnoseInitializationFlow();
forceInitialLoad();

// Diagnóstico de filtros
diagnoseEquipmentInit();
diagnoseDOMElements();
diagnoseEventListeners();
```

### Troubleshooting recomendado
- Si los equipos no se muestran tras iniciar el servidor, ejecuta `forceInitialLoad()`.
- Si los filtros no funcionan, usa `diagnoseEquipmentInit()` y revisa la consola para detalles.
- Para limpiar el estado de filtros y paginación, usa `Equipment.cleanState()` desde consola.

Estos scripts están pensados para facilitar la depuración y mejorar la experiencia de desarrollo y soporte técnico.

---

**Versión**: 2.0.0  
**Última actualización**: Agosto 2025  
**Estado**: ✅ Funcional - Todas las funcionalidades principales implementadas y probadas
