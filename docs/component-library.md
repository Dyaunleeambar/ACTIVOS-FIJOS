# 📚 Biblioteca de Componentes - Sistema de Gestión de Medios Informáticos

## 🎯 Propósito

Esta biblioteca documenta todos los componentes reutilizables del sistema, proporcionando ejemplos de uso, variantes y mejores prácticas para mantener consistencia en el desarrollo.

## 📋 Índice

1. [Botones](#botones)
2. [Formularios](#formularios)
3. [Cards](#cards)
4. [Modales](#modales)
5. [Tablas](#tablas)
6. [Navegación](#navegación)
7. [Indicadores](#indicadores)
8. [Gráficos](#gráficos)
9. [Alertas](#alertas)
10. [Loading](#loading)

---

## 🔘 Botones

### Botón Primario
```html
<button class="btn btn-primary">
  <i class="fas fa-plus"></i>
  Agregar Equipo
</button>
```

### Botón Secundario
```html
<button class="btn btn-secondary">
  <i class="fas fa-edit"></i>
  Editar
</button>
```

### Botón de Peligro
```html
<button class="btn btn-danger">
  <i class="fas fa-trash"></i>
  Eliminar
</button>
```

### Botón Outline
```html
<button class="btn btn-outline">
  <i class="fas fa-download"></i>
  Exportar
</button>
```

### Variantes de Tamaño
```html
<button class="btn btn-primary btn-sm">Pequeño</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>
```

### Estados
```html
<button class="btn btn-primary" disabled>Deshabilitado</button>
<button class="btn btn-primary loading">Cargando...</button>
```

---

## 📝 Formularios

### Input Básico
```html
<div class="form-group">
  <label for="serial" class="form-label">Número de Serie</label>
  <input 
    type="text" 
    id="serial" 
    name="serial" 
    class="form-input"
    placeholder="Ingrese el número de serie"
    required
  >
  <div class="form-error">Este campo es requerido</div>
</div>
```

### Select
```html
<div class="form-group">
  <label for="type" class="form-label">Tipo de Equipo</label>
  <select id="type" name="type" class="form-select">
    <option value="">Seleccione un tipo</option>
    <option value="desktop">Desktop</option>
    <option value="laptop">Laptop</option>
    <option value="printer">Impresora</option>
  </select>
</div>
```

### Textarea
```html
<div class="form-group">
  <label for="description" class="form-label">Descripción</label>
  <textarea 
    id="description" 
    name="description" 
    class="form-textarea"
    rows="4"
    placeholder="Descripción del equipo..."
  ></textarea>
</div>
```

### Checkbox
```html
<div class="form-group">
  <label class="form-checkbox">
    <input type="checkbox" name="active" class="form-checkbox-input">
    <span class="form-checkbox-label">Equipo Activo</span>
  </label>
</div>
```

### Radio Buttons
```html
<div class="form-group">
  <label class="form-label">Estado del Equipo</label>
  <div class="form-radio-group">
    <label class="form-radio">
      <input type="radio" name="status" value="active" class="form-radio-input">
      <span class="form-radio-label">Activo</span>
    </label>
    <label class="form-radio">
      <input type="radio" name="status" value="maintenance" class="form-radio-input">
      <span class="form-radio-label">Mantenimiento</span>
    </label>
  </div>
</div>
```

---

## 🃏 Cards

### Card Básica
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Información del Equipo</h3>
    <div class="card-actions">
      <button class="btn btn-sm btn-outline">Editar</button>
    </div>
  </div>
  <div class="card-body">
    <p>Contenido de la card...</p>
  </div>
  <div class="card-footer">
    <small class="text-muted">Última actualización: hace 2 horas</small>
  </div>
</div>
```

### Card de Estadísticas
```html
<div class="card card-stats">
  <div class="card-body">
    <div class="stats-icon">
      <i class="fas fa-desktop"></i>
    </div>
    <div class="stats-content">
      <h3 class="stats-number">1,234</h3>
      <p class="stats-label">Equipos Activos</p>
    </div>
  </div>
</div>
```

### Card de Equipo
```html
<div class="card card-equipment">
  <div class="card-header">
    <span class="status-badge status-active">Activo</span>
    <h4 class="equipment-title">Desktop HP ProDesk 600</h4>
  </div>
  <div class="card-body">
    <div class="equipment-details">
      <div class="detail-item">
        <span class="detail-label">Serie:</span>
        <span class="detail-value">HP123456789</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Ubicación:</span>
        <span class="detail-value">Oficina Central</span>
      </div>
    </div>
  </div>
  <div class="card-footer">
    <button class="btn btn-sm btn-primary">Ver Detalles</button>
    <button class="btn btn-sm btn-outline">Editar</button>
  </div>
</div>
```

---

## 🪟 Modales

### Modal Básico
```html
<div class="modal" id="equipmentModal">
  <div class="modal-overlay"></div>
  <div class="modal-container">
    <div class="modal-header">
      <h3 class="modal-title">Agregar Nuevo Equipo</h3>
      <button class="modal-close" data-modal-close>
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body">
      <form class="form">
        <!-- Contenido del formulario -->
      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" data-modal-close>Cancelar</button>
      <button class="btn btn-primary">Guardar</button>
    </div>
  </div>
</div>
```

### Modal de Confirmación
```html
<div class="modal modal-confirmation" id="deleteModal">
  <div class="modal-overlay"></div>
  <div class="modal-container">
    <div class="modal-body">
      <div class="confirmation-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3 class="confirmation-title">¿Eliminar Equipo?</h3>
      <p class="confirmation-message">
        Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar este equipo?
      </p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" data-modal-close>Cancelar</button>
      <button class="btn btn-danger">Eliminar</button>
    </div>
  </div>
</div>
```

---

## 📊 Tablas

### Tabla Básica
```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Número de Serie</th>
        <th>Tipo</th>
        <th>Estado</th>
        <th>Ubicación</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>HP123456789</td>
        <td>Desktop</td>
        <td><span class="status-badge status-active">Activo</span></td>
        <td>Oficina Central</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-outline">Ver</button>
            <button class="btn btn-sm btn-outline">Editar</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Tabla con Paginación
```html
<div class="table-container">
  <table class="table">
    <!-- Contenido de la tabla -->
  </table>
  <div class="table-pagination">
    <div class="pagination-info">
      Mostrando 1-10 de 50 resultados
    </div>
    <div class="pagination-controls">
      <button class="btn btn-sm btn-outline" disabled>Anterior</button>
      <button class="btn btn-sm btn-primary">1</button>
      <button class="btn btn-sm btn-outline">2</button>
      <button class="btn btn-sm btn-outline">3</button>
      <button class="btn btn-sm btn-outline">Siguiente</button>
    </div>
  </div>
</div>
```

---

## 🧭 Navegación

### Sidebar
```html
<nav class="sidebar">
  <div class="sidebar-header">
    <h2 class="sidebar-title">Sistema de Gestión</h2>
  </div>
  <ul class="sidebar-menu">
    <li class="sidebar-item">
      <a href="/dashboard" class="sidebar-link active">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </a>
    </li>
    <li class="sidebar-item">
      <a href="/equipment" class="sidebar-link">
        <i class="fas fa-desktop"></i>
        <span>Equipos</span>
      </a>
    </li>
    <li class="sidebar-item">
      <a href="/reports" class="sidebar-link">
        <i class="fas fa-chart-bar"></i>
        <span>Reportes</span>
      </a>
    </li>
  </ul>
</nav>
```

### Breadcrumb
```html
<nav class="breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item">
      <a href="/dashboard">Dashboard</a>
    </li>
    <li class="breadcrumb-item">
      <a href="/equipment">Equipos</a>
    </li>
    <li class="breadcrumb-item active">
      Detalles del Equipo
    </li>
  </ol>
</nav>
```

---

## 📈 Indicadores

### Badges de Estado
```html
<span class="status-badge status-active">Activo</span>
<span class="status-badge status-maintenance">Mantenimiento</span>
<span class="status-badge status-out-of-service">Fuera de Servicio</span>
<span class="status-badge status-disposed">Desechado</span>
```

### Progress Bar
```html
<div class="progress">
  <div class="progress-bar" style="width: 75%">
    <span class="progress-text">75%</span>
  </div>
</div>
```

### Spinner
```html
<div class="spinner">
  <div class="spinner-ring"></div>
</div>
```

---

## 📊 Gráficos

### Gráfico de Barras
```html
<div class="chart-container">
  <canvas id="equipmentChart"></canvas>
</div>
```

### Gráfico de Dona
```html
<div class="chart-container">
  <canvas id="statusChart"></canvas>
</div>
```

---

## ⚠️ Alertas

### Alerta de Éxito
```html
<div class="alert alert-success">
  <i class="fas fa-check-circle"></i>
  <div class="alert-content">
    <h4 class="alert-title">Éxito</h4>
    <p class="alert-message">El equipo se ha guardado correctamente.</p>
  </div>
  <button class="alert-close">
    <i class="fas fa-times"></i>
  </button>
</div>
```

### Alerta de Error
```html
<div class="alert alert-error">
  <i class="fas fa-exclamation-circle"></i>
  <div class="alert-content">
    <h4 class="alert-title">Error</h4>
    <p class="alert-message">No se pudo guardar el equipo. Intente nuevamente.</p>
  </div>
  <button class="alert-close">
    <i class="fas fa-times"></i>
  </button>
</div>
```

### Alerta de Advertencia
```html
<div class="alert alert-warning">
  <i class="fas fa-exclamation-triangle"></i>
  <div class="alert-content">
    <h4 class="alert-title">Advertencia</h4>
    <p class="alert-message">Algunos campos están incompletos.</p>
  </div>
  <button class="alert-close">
    <i class="fas fa-times"></i>
  </button>
</div>
```

---

## ⏳ Loading

### Loading Overlay
```html
<div class="loading-overlay">
  <div class="loading-spinner">
    <div class="spinner-ring"></div>
    <p class="loading-text">Cargando...</p>
  </div>
</div>
```

### Skeleton Loading
```html
<div class="skeleton">
  <div class="skeleton-header">
    <div class="skeleton-title"></div>
    <div class="skeleton-subtitle"></div>
  </div>
  <div class="skeleton-content">
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
  </div>
</div>
```

---

## 🎨 Clases de Utilidad

### Espaciado
```html
<div class="p-4">Padding 4</div>
<div class="m-2">Margin 2</div>
<div class="mt-3">Margin Top 3</div>
<div class="mb-4">Margin Bottom 4</div>
```

### Display
```html
<div class="d-flex">Display Flex</div>
<div class="d-grid">Display Grid</div>
<div class="d-none">Display None</div>
<div class="d-block">Display Block</div>
```

### Texto
```html
<p class="text-center">Texto Centrado</p>
<p class="text-left">Texto Izquierda</p>
<p class="text-right">Texto Derecha</p>
<p class="text-primary">Texto Primario</p>
<p class="text-secondary">Texto Secundario</p>
```

### Bordes
```html
<div class="border">Borde</div>
<div class="border-top">Borde Superior</div>
<div class="border-bottom">Borde Inferior</div>
<div class="rounded">Bordes Redondeados</div>
```

---

## 📱 Responsive

### Breakpoints
```html
<div class="d-none d-md-block">Visible en MD+</div>
<div class="d-block d-md-none">Visible en móvil</div>
<div class="col-12 col-md-6 col-lg-4">Grid Responsive</div>
```

### Navegación Móvil
```html
<button class="mobile-menu-toggle">
  <i class="fas fa-bars"></i>
</button>
```

---

## ♿ Accesibilidad

### Screen Reader Only
```html
<span class="sr-only">Texto solo para lectores de pantalla</span>
```

### Focus Visible
```html
<button class="btn btn-primary focus-visible">Botón con Focus</button>
```

### ARIA Labels
```html
<button class="btn btn-primary" aria-label="Agregar nuevo equipo">
  <i class="fas fa-plus"></i>
</button>
```

---

## 🔧 JavaScript

### Inicialización de Componentes
```javascript
// Inicializar modales
document.querySelectorAll('[data-modal]').forEach(modal => {
  new Modal(modal);
});

// Inicializar tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
  new Tooltip(element);
});

// Inicializar dropdowns
document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
  new Dropdown(dropdown);
});
```

### Eventos de Componentes
```javascript
// Evento de modal
modal.addEventListener('modal:open', (event) => {
  console.log('Modal abierto:', event.detail);
});

// Evento de alerta
alert.addEventListener('alert:close', (event) => {
  console.log('Alerta cerrada:', event.detail);
});
```

---

## 📚 Recursos Adicionales

### Iconos
- **Font Awesome**: `fas fa-*`
- **Heroicons**: `hero-*`
- **Material Icons**: `material-*`

### Librerías Externas
- **Chart.js**: Para gráficos
- **SweetAlert2**: Para alertas avanzadas
- **Moment.js**: Para manejo de fechas

### Herramientas de Desarrollo
- **Chrome DevTools**: Para debugging
- **Lighthouse**: Para auditorías
- **Color Contrast Analyzer**: Para accesibilidad

---

*Biblioteca de Componentes - Sistema de Gestión de Medios Informáticos - Versión 1.0* 
