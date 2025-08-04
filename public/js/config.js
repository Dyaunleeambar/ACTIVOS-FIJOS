// Configuración del Frontend
const CONFIG = {
    // Configuración de la API
    API_BASE_URL: window.location.origin + '/api',
    API_TIMEOUT: 30000,
    
    // Configuración de la aplicación
    APP_NAME: 'Sistema de Gestión de Medios Informáticos',
    APP_VERSION: '1.0.0',
    
    // Configuración de autenticación
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data',
    
    // Configuración de paginación
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    
    // Configuración de notificaciones
    NOTIFICATION_TIMEOUT: 5000,
    
    // Configuración de charts
    CHART_COLORS: {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8'
    },
    
    // Configuración de equipos
    EQUIPMENT_TYPES: {
        desktop: 'Desktop',
        laptop: 'Laptop',
        printer: 'Impresora',
        server: 'Servidor',
        router: 'Router',
        switch: 'Switch',
        radio_communication: 'Radio Comunicación',
        sim_chip: 'Chip SIM',
        roaming: 'Roaming',
        other: 'Otro'
    },
    
    EQUIPMENT_STATUS: {
        active: 'Activo',
        maintenance: 'Mantenimiento',
        out_of_service: 'Fuera de Servicio',
        disposed: 'Dado de Baja'
    },
    
    // Configuración de roles
    ROLES: {
        admin: 'Administrador',
        manager: 'Manager',
        consultant: 'Consultor'
    },
    
    // Configuración de estados de propuestas
    DISPOSAL_STATUS: {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        completed: 'Completada'
    },
    
    DISPOSAL_REASONS: {
        damage: 'Daño',
        obsolescence: 'Obsolescencia',
        loss: 'Pérdida'
    }
};

// Utilidades de configuración
const ConfigUtils = {
    // Obtener URL completa de la API
    getApiUrl: (endpoint) => {
        return CONFIG.API_BASE_URL + endpoint;
    },
    
    // Obtener token de autenticación
    getAuthToken: () => {
        return sessionStorage.getItem(CONFIG.TOKEN_KEY);
    },
    
    // Guardar token de autenticación
    setAuthToken: (token) => {
        sessionStorage.setItem(CONFIG.TOKEN_KEY, token);
    },
    
    // Eliminar token de autenticación
    removeAuthToken: () => {
        sessionStorage.removeItem(CONFIG.TOKEN_KEY);
    },
    
    // Obtener datos del usuario
    getUserData: () => {
        const userData = sessionStorage.getItem(CONFIG.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },
    
    // Guardar datos del usuario
    setUserData: (userData) => {
        sessionStorage.setItem(CONFIG.USER_KEY, JSON.stringify(userData));
    },
    
    // Eliminar datos del usuario
    removeUserData: () => {
        sessionStorage.removeItem(CONFIG.USER_KEY);
    },
    
    // Verificar si el usuario está autenticado
    isAuthenticated: () => {
        return !!ConfigUtils.getAuthToken();
    },
    
    // Obtener headers para requests autenticados
    getAuthHeaders: () => {
        const token = ConfigUtils.getAuthToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    },
    
    // Formatear fecha
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Formatear número de inventario
    formatInventoryNumber: (number) => {
        return number || 'N/A';
    },
    
    // Obtener color para estado de equipo
    getStatusColor: (status) => {
        const colors = {
            active: CONFIG.CHART_COLORS.success,
            maintenance: CONFIG.CHART_COLORS.warning,
            out_of_service: CONFIG.CHART_COLORS.danger,
            disposed: CONFIG.CHART_COLORS.secondary
        };
        return colors[status] || CONFIG.CHART_COLORS.secondary;
    },
    
    // Obtener texto para tipo de equipo
    getEquipmentTypeText: (type) => {
        return CONFIG.EQUIPMENT_TYPES[type] || type;
    },
    
    // Obtener texto para estado de equipo
    getEquipmentStatusText: (status) => {
        return CONFIG.EQUIPMENT_STATUS[status] || status;
    },
    
    // Obtener texto para rol de usuario
    getUserRoleText: (role) => {
        return CONFIG.ROLES[role] || role;
    },
    
    // Validar email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validar número de inventario
    isValidInventoryNumber: (number) => {
        return number && number.length >= 3;
    },
    
    // Capitalizar primera letra
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // Generar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Configuración de desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.API_BASE_URL = 'http://localhost:3001/api';
    console.log('🔧 Modo desarrollo detectado');
    console.log('📡 API URL:', CONFIG.API_BASE_URL);
}

// Exportar configuración global
window.CONFIG = CONFIG;
window.ConfigUtils = ConfigUtils; 
