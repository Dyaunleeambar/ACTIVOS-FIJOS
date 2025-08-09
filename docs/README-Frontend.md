# Frontend - Sistema de Gestión de Medios Informáticos

## 🚀 **Configuración Inicial**

### **1. Estructura del Proyecto**
```
public/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos principales
│   ├── dashboard.css       # Estilos del dashboard
│   ├── forms.css           # Estilos de formularios
│   └── components.css      # Estilos de componentes
├── js/
│   ├── config.js           # Configuración global
│   ├── auth.js             # Módulo de autenticación
│   ├── api.js              # Módulo de API
│   ├── ui.js               # Utilidades de UI
│   ├── app.js              # Aplicación principal
│   ├── dashboard.js        # Módulo del dashboard
│   └── equipment.js        # Módulo de equipos
└── images/                 # Imágenes del proyecto
```

### **2. Tecnologías Utilizadas**
- **HTML5**: Estructura semántica moderna
- **CSS3**: Estilos con Flexbox, Grid, y animaciones
- **JavaScript ES6+**: Vanilla JS con módulos
- **Chart.js**: Gráficos interactivos
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía Inter

## 🎨 **Características de Diseño**

### **Diseño Responsive**
- ✅ **Mobile First**: Optimizado para dispositivos móviles
- ✅ **Breakpoints**: 768px, 1024px, 1200px
- ✅ **Flexible Layout**: Adaptable a diferentes tamaños
- ✅ **Touch Friendly**: Botones y elementos táctiles

### **Sistema de Colores**
```css
/* Colores principales */
--primary: #667eea
--secondary: #764ba2
--success: #28a745
--warning: #ffc107
--danger: #dc3545
--info: #17a2b8
```

### **Tipografía**
- **Familia**: Inter (Google Fonts)
- **Tamaños**: 12px, 14px, 16px, 18px, 24px, 32px
- **Pesos**: 300, 400, 500, 600, 700

## 🔐 **Sistema de Autenticación**

### **Flujo de Login**
1. **Validación de credenciales** en el frontend
2. **Request a la API** con username/password
3. **Verificación JWT** en el backend
4. **Almacenamiento local** del token
5. **Redirección** a la aplicación principal

### **Gestión de Tokens**
```javascript
// Almacenamiento seguro
localStorage.setItem('auth_token', token);
localStorage.setItem('user_data', JSON.stringify(user));

// Verificación automática
const token = localStorage.getItem('auth_token');
if (token && !isExpired(token)) {
    // Usuario autenticado
}
```

### **Roles y Permisos**
- **admin**: Acceso completo
- **manager**: Gestión en su estado
- **consultant**: Solo consulta de equipos asignados

## 📊 **Dashboard**

### **Estadísticas en Tiempo Real**
- Total de equipos
- Equipos activos
- Equipos en mantenimiento
- Total de asignaciones

### **Gráficos Interactivos**
- **Doughnut Chart**: Equipos por tipo
- **Bar Chart**: Equipos por estado
- **Responsive**: Se adaptan al tamaño de pantalla

### **Datos de Ejemplo**
```javascript
stats: {
    totalEquipment: 25,
    activeEquipment: 20,
    maintenanceEquipment: 3,
    totalAssignments: 18
}
```

## 🖥️ **Gestión de Equipos**

### **Funcionalidades Implementadas**
- ✅ **Listado con paginación**
- ✅ **Filtros avanzados** (tipo, estado, ubicación)
- ✅ **Búsqueda en tiempo real**
- ✅ **Creación de equipos**
- ✅ **Visualización de detalles**
- ✅ **Eliminación con confirmación**

### **Filtros Disponibles**
```javascript
filters: {
    type: 'desktop|laptop|printer|server|router|switch|radio_communication|sim_chip|roaming|other',
    status: 'active|maintenance|out_of_service|disposed',
    state_id: 'ID del estado'
}
```

### **Formulario de Creación**
- Número de inventario (único)
- Nombre del equipo
- Tipo de equipo
- Estado geográfico
- Marca y modelo
- Especificaciones técnicas
- Detalles de ubicación

## 🔧 **API Integration**

### **Configuración Base**
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    API_TIMEOUT: 30000,
    DEFAULT_PAGE_SIZE: 20
};
```

### **Endpoints Utilizados**
- `POST /api/auth/login` - Autenticación
- `GET /api/equipment` - Listar equipos
- `POST /api/equipment` - Crear equipo
- `GET /api/equipment/:id` - Ver equipo
- `DELETE /api/equipment/:id` - Eliminar equipo

### **Manejo de Errores**
```javascript
// Interceptor global
fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        UI.showNotification(error.message, 'error');
    });
```

## 🎯 **Componentes UI**

### **Sistema de Notificaciones**
```javascript
UI.showNotification('Mensaje de éxito', 'success');
UI.showNotification('Mensaje de error', 'error');
UI.showNotification('Mensaje de advertencia', 'warning');
UI.showNotification('Mensaje informativo', 'info');
```

### **Modales**
```javascript
UI.showModal('Título', 'Contenido HTML');
UI.closeModal();
```

### **Loading States**
```javascript
UI.showLoading('#container', 'Cargando...');
UI.hideLoading('#container');
```

### **Estados Vacíos**
```javascript
UI.showEmptyState('#container', 'No hay datos disponibles');
```

## 📱 **Responsive Design**

### **Breakpoints**
```css
/* Mobile */
@media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
    .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1025px) {
    .dashboard-grid { grid-template-columns: repeat(4, 1fr); }
}
```

### **Navegación Móvil**
- Sidebar colapsable
- Menú hamburguesa
- Gestos táctiles
- Optimización para pantallas pequeñas

## 🚀 **Performance**

### **Optimizaciones Implementadas**
- ✅ **Lazy Loading**: Carga bajo demanda
- ✅ **Debounce**: Evita requests excesivos
- ✅ **Caching**: Datos en localStorage
- ✅ **Minificación**: CSS y JS optimizados
- ✅ **CDN**: Librerías externas

### **Métricas Objetivo**
- **First Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: > 90

## 🔒 **Seguridad**

### **Medidas Implementadas**
- ✅ **CSP Headers**: Content Security Policy
- ✅ **XSS Protection**: Sanitización de inputs
- ✅ **CSRF Protection**: Tokens en requests
- ✅ **Input Validation**: Validación en frontend
- ✅ **Secure Storage**: Tokens en localStorage

### **Validaciones Frontend**
```javascript
// Validación de email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validación de número de inventario
const isValidInventoryNumber = (number) => {
    return number && number.length >= 3;
};
```

## 🧪 **Testing**

### **Funcionalidades a Probar**
- [ ] Login/Logout
- [ ] Navegación entre páginas
- [ ] Creación de equipos
- [ ] Filtros y búsqueda
- [ ] Paginación
- [ ] Responsive design
- [ ] Manejo de errores

### **Herramientas Recomendadas**
- **Jest**: Testing framework
- **Cypress**: E2E testing
- **Lighthouse**: Performance testing
- **Browser DevTools**: Debugging

## 📦 **Deployment**

### **Build Process**
```bash
# Optimizar CSS
npm run build:css

# Minificar JavaScript
npm run build:js

# Crear bundle
npm run build
```

### **Servidor de Producción**
```javascript
// Configuración para producción
const productionConfig = {
    API_BASE_URL: 'https://api.tudominio.com',
    NODE_ENV: 'production',
    ENABLE_LOGGING: false
};
```

## 🔄 **Próximos Pasos**

### **Funcionalidades Pendientes**
- [ ] **Edición de equipos**
- [ ] **Gestión de asignaciones**
- [ ] **Movimientos de equipos**
- [ ] **Control de seguridad**
- [ ] **Reportes avanzados**
- [ ] **Propuestas de baja**
- [ ] **Exportación PDF/Excel**
- [ ] **Notificaciones push**

### **Mejoras Técnicas**
- [ ] **Service Workers**: Offline support
- [ ] **PWA**: Progressive Web App
- [ ] **WebSockets**: Real-time updates
- [ ] **WebRTC**: Video calls
- [ ] **IndexedDB**: Local storage avanzado

---

## 🛠️ Utilidades de Diagnóstico y Limpieza (Frontend)

El frontend incluye scripts y funciones para depuración y solución automática de problemas:

### Función `cleanState` en Equipment
Permite limpiar todos los filtros, la paginación y los chips activos de la interfaz de equipos. Útil para restablecer la vista y depurar problemas de estado.

```js
// Limpiar filtros y paginación de equipos
equipmentInstance.cleanState();
// O desde consola global:
Equipment.cleanState();
```

### Inicialización automática y troubleshooting
- El sistema intenta inicializar automáticamente la lista de equipos al cargar la página. Si no se muestran datos, puedes forzar la carga ejecutando:
  ```js
  forceInitialLoad();
  ```
- Para diagnosticar problemas de inicialización, usa:
  ```js
  diagnoseInitialLoad();
  diagnoseInitializationFlow();
  ```
- Para depurar filtros y elementos del DOM:
  ```js
  diagnoseEquipmentInit();
  diagnoseDOMElements();
  diagnoseEventListeners();
  ```

### Scripts relevantes
- `public/js/diagnose-initial-load.js`
- `public/js/auto-fix-initial-load.js`
- `public/js/diagnose-filters.js`
- `public/js/debug-filters.js`

Consulta la sección de troubleshooting del README principal para ejemplos de uso y recomendaciones.

---

*Frontend - Sistema de Gestión de Medios Informáticos - Versión 1.0* 