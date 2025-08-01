# 🎨 Sistema de Diseño - Sistema de Gestión de Medios Informáticos

## 📋 Índice
1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Design Tokens](#design-tokens)
3. [Tipografía](#tipografía)
4. [Colores](#colores)
5. [Componentes](#componentes)
6. [Patrones](#patrones)
7. [Accesibilidad](#accesibilidad)
8. [Responsive Design](#responsive-design)

---

## 🎯 Filosofía de Diseño

### Principios Fundamentales
- **Claridad**: Interfaz limpia y fácil de entender
- **Consistencia**: Patrones uniformes en toda la aplicación
- **Eficiencia**: Flujos optimizados para usuarios expertos
- **Accesibilidad**: Cumplimiento WCAG 2.1 AA
- **Escalabilidad**: Sistema que crece con el proyecto

### Personalidad de Marca
- **Profesional**: Diseño corporativo serio
- **Confiable**: Colores y formas que transmiten seguridad
- **Moderno**: Tecnología actual sin ser experimental
- **Funcional**: Prioridad a la usabilidad sobre la estética

---

## 🎨 Design Tokens

### Estructura de Variables CSS
```css
/* Ejemplo de uso */
.button-primary {
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-normal);
}
```

### Jerarquía de Tokens
1. **Base**: Colores, tipografía, espaciado
2. **Componentes**: Botones, inputs, cards
3. **Patrones**: Layouts, navegación, formularios
4. **Páginas**: Vistas específicas del sistema

---

## 📝 Tipografía

### Familia de Fuentes
```css
/* Fuente Principal */
font-family: var(--font-family-primary);
/* Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif */

/* Fuente Mono (para códigos) */
font-family: var(--font-family-mono);
/* 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace */
```

### Escala de Tamaños
| Clase | Tamaño | Uso |
|-------|--------|-----|
| `--font-size-xs` | 12px | Etiquetas pequeñas, badges |
| `--font-size-sm` | 14px | Texto secundario, captions |
| `--font-size-base` | 16px | Texto del cuerpo |
| `--font-size-lg` | 18px | Subtítulos |
| `--font-size-xl` | 20px | Títulos de sección |
| `--font-size-2xl` | 24px | Títulos principales |
| `--font-size-3xl` | 30px | Headers grandes |
| `--font-size-4xl` | 36px | Títulos de página |
| `--font-size-5xl` | 48px | Headers hero |
| `--font-size-6xl` | 60px | Títulos monumentales |

### Pesos de Fuente
```css
/* Pesos disponibles */
--font-weight-light: 300;      /* Texto fino */
--font-weight-normal: 400;     /* Texto normal */
--font-weight-medium: 500;     /* Texto medio */
--font-weight-semibold: 600;   /* Texto semi-negrita */
--font-weight-bold: 700;       /* Texto negrita */
--font-weight-extrabold: 800;  /* Texto extra-negrita */
```

### Altura de Línea
```css
/* Alturas recomendadas */
--line-height-tight: 1.25;     /* Títulos */
--line-height-normal: 1.5;     /* Texto del cuerpo */
--line-height-relaxed: 1.75;   /* Texto largo */
--line-height-loose: 2;        /* Texto muy largo */
```

---

## 🎨 Colores

### Paleta de Colores

#### Colores Primarios
```css
/* Azul Principal */
--color-primary-500: #3b82f6;  /* Color principal */
--color-primary-600: #2563eb;  /* Hover/Active */
--color-primary-700: #1d4ed8;  /* Pressed */
```

#### Colores Secundarios
```css
/* Púrpura Secundario */
--color-secondary-500: #a855f7; /* Color secundario */
--color-secondary-600: #9333ea; /* Hover/Active */
--color-secondary-700: #7c3aed; /* Pressed */
```

#### Estados de Sistema
```css
/* Estados de Equipos */
--color-status-active: #22c55e;        /* Verde - Activo */
--color-status-maintenance: #f59e0b;   /* Amarillo - Mantenimiento */
--color-status-out-of-service: #ef4444; /* Rojo - Fuera de servicio */
--color-status-disposed: #6b7280;      /* Gris - Desechado */
```

### Uso Semántico de Colores

#### Texto
```css
/* Jerarquía de texto */
--color-text-primary: #111827;    /* Texto principal */
--color-text-secondary: #4b5563;  /* Texto secundario */
--color-text-tertiary: #6b7280;   /* Texto terciario */
--color-text-inverse: #f9fafb;    /* Texto sobre fondo oscuro */
```

#### Fondos
```css
/* Fondos */
--color-background-primary: #ffffff;   /* Fondo principal */
--color-background-secondary: #f9fafb; /* Fondo secundario */
--color-background-tertiary: #f3f4f6;  /* Fondo terciario */
```

#### Bordes
```css
/* Bordes */
--color-border-primary: #e5e7eb;   /* Bordes principales */
--color-border-secondary: #d1d5db; /* Bordes secundarios */
--color-border-focus: #3b82f6;     /* Borde de focus */
```

---

## 🧩 Componentes

### Botones

#### Botón Primario
```css
.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--gradient-primary-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

#### Botón Secundario
```css
.btn-secondary {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border: var(--border-width-1) var(--border-style-solid) var(--color-border-primary);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-normal);
}

.btn-secondary:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-border-secondary);
}
```

#### Tamaños de Botones
```css
/* Tamaños disponibles */
.btn-sm {
  height: var(--button-height-sm);
  padding: var(--spacing-2) var(--button-padding-x-sm);
  font-size: var(--font-size-sm);
}

.btn-md {
  height: var(--button-height-md);
  padding: var(--spacing-3) var(--button-padding-x-md);
  font-size: var(--font-size-base);
}

.btn-lg {
  height: var(--button-height-lg);
  padding: var(--spacing-4) var(--button-padding-x-lg);
  font-size: var(--font-size-lg);
}
```

### Inputs

#### Input Estándar
```css
.form-input {
  width: 100%;
  height: var(--input-height-md);
  padding: var(--spacing-3) var(--input-padding-x-md);
  border: var(--border-width-1) var(--border-style-solid) var(--color-border-primary);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: var(--transition-normal);
  background: var(--color-background-primary);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

#### Estados de Input
```css
/* Estados */
.form-input:disabled {
  background: var(--color-background-tertiary);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.form-input.error {
  border-color: var(--color-error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input.success {
  border-color: var(--color-success-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}
```

### Cards

#### Card Básica
```css
.card {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-xl);
  padding: var(--card-padding-md);
  box-shadow: var(--shadow-base);
  border: var(--border-width-1) var(--border-style-solid) var(--color-border-primary);
  transition: var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

#### Card de Dashboard
```css
.dashboard-card {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-xl);
  padding: var(--card-padding-md);
  box-shadow: var(--shadow-sm);
  border: var(--border-width-1) var(--border-style-solid) var(--color-border-primary);
  transition: var(--transition-normal);
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### Modales

#### Modal Básico
```css
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-background-primary);
  border-radius: var(--border-radius-2xl);
  padding: var(--modal-padding);
  box-shadow: var(--shadow-2xl);
  max-width: var(--modal-max-width);
  width: 90%;
  z-index: var(--z-index-modal);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-background-overlay);
  z-index: var(--z-index-modal-backdrop);
}
```

---

## 📐 Patrones

### Layout

#### Grid System
```css
/* Grid Responsive */
.grid {
  display: grid;
  gap: var(--spacing-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive */
@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

#### Flexbox Utilities
```css
/* Flex Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
```

### Navegación

#### Sidebar
```css
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-background-primary);
  border-right: var(--border-width-1) var(--border-style-solid) var(--color-border-primary);
  transition: var(--transition-normal);
}

.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
}
```

#### Header
```css
.header {
  height: var(--header-height);
  background: var(--color-background-primary);
  border-bottom: var(--border-width-1) var(--border-style-solid) var(--color-border-primary);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-6);
}

@media (max-width: 768px) {
  .header {
    height: var(--header-height-mobile);
    padding: 0 var(--spacing-4);
  }
}
```

### Formularios

#### Layout de Formulario
```css
.form-group {
  margin-bottom: var(--spacing-6);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-help {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.form-error {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
}
```

---

## ♿ Accesibilidad

### Focus Management
```css
/* Focus Visible */
.focus-visible {
  outline: var(--focus-ring-width) var(--border-style-solid) var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

/* Focus para elementos interactivos */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: var(--focus-ring-width) var(--border-style-solid) var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

### Contraste de Colores
```css
/* Contraste mínimo requerido */
--contrast-ratio-min: 4.5;    /* Texto normal */
--contrast-ratio-large: 3;    /* Texto grande */
```

### Tamaños de Toque
```css
/* Tamaño mínimo para elementos táctiles */
--touch-target-min: 2.75rem;  /* 44px - WCAG 2.1 */
```

### Screen Reader Support
```css
/* Clases para screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Breakpoints del sistema */
--breakpoint-xs: 0;        /* Extra small */
--breakpoint-sm: 640px;    /* Small */
--breakpoint-md: 768px;    /* Medium */
--breakpoint-lg: 1024px;   /* Large */
--breakpoint-xl: 1280px;   /* Extra large */
--breakpoint-2xl: 1536px;  /* 2X large */
```

### Mobile First
```css
/* Ejemplo de Mobile First */
.container {
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-8);
  }
}
```

### Responsive Typography
```css
/* Tipografía responsive */
.responsive-text {
  font-size: var(--font-size-base);
}

@media (min-width: 768px) {
  .responsive-text {
    font-size: var(--font-size-lg);
  }
}

@media (min-width: 1024px) {
  .responsive-text {
    font-size: var(--font-size-xl);
  }
}
```

---

## 🎯 Guías de Uso

### Cuándo Usar Cada Componente

#### Botones
- **Primario**: Acciones principales (Guardar, Crear, Confirmar)
- **Secundario**: Acciones secundarias (Cancelar, Volver)
- **Danger**: Acciones destructivas (Eliminar, Desactivar)

#### Cards
- **Dashboard**: Información resumida y métricas
- **Detalle**: Información completa de un elemento
- **Acción**: Cards con botones de acción

#### Modales
- **Confirmación**: Confirmar acciones importantes
- **Formulario**: Crear o editar elementos
- **Información**: Mostrar detalles adicionales

### Mejores Prácticas

#### Consistencia
- Usar siempre las variables CSS definidas
- Mantener la jerarquía visual
- Seguir los patrones establecidos

#### Performance
- Minimizar el uso de sombras complejas
- Optimizar las transiciones
- Usar transform en lugar de position cuando sea posible

#### Mantenimiento
- Documentar cambios en el sistema
- Mantener la compatibilidad hacia atrás
- Revisar regularmente la accesibilidad

---

## 📚 Recursos

### Herramientas Recomendadas
- **Color Contrast Analyzer**: Para verificar contraste
- **Lighthouse**: Para auditorías de accesibilidad
- **Chrome DevTools**: Para debugging de CSS
- **Figma**: Para diseño de componentes

### Referencias
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Ant Design](https://ant.design/docs/spec/introduce)
- [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/)

---

*Documento del Sistema de Diseño - Versión 1.0* 
