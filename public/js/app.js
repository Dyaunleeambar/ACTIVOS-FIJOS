// Aplicación Principal
const App = {
    // Estado de la aplicación
    currentPage: 'dashboard',
    isLoading: false,
    
    // Inicializar aplicación
    init: function() {
        console.log('🚀 Inicializando aplicación...');
        
        this.setupEventListeners();
        this.loadInitialData();
        this.handleHashChange();
        
        console.log('✅ Aplicación inicializada');
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Manejar cambios en el hash de la URL
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
        
        // Manejar clic en botón de agregar equipo
        const addEquipmentBtn = document.getElementById('add-equipment-btn');
        if (addEquipmentBtn) {
            addEquipmentBtn.addEventListener('click', () => {
                Equipment.showCreateModal();
            });
        }
        
        // Manejar filtros de equipos
        const applyFiltersBtn = document.getElementById('apply-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                Equipment.loadEquipment();
            });
        }
        
        // Manejar paginación
        document.addEventListener('click', (e) => {
            if (e.target.matches('.page-number')) {
                e.preventDefault();
                const page = parseInt(e.target.textContent);
                this.handlePageChange(page);
            }
        });
        
        // Manejar botones de auditoría en el dropdown del usuario
        this.setupAuditButtons();
    },
    
    // Configurar botones de auditoría
    setupAuditButtons: function() {
        // Botón de Accesibilidad
        const accessibilityLink = document.getElementById('accessibility-link');
        if (accessibilityLink) {
            accessibilityLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.AccessibilityValidator) {
                    const validator = new AccessibilityValidator();
                    validator.showReport();
                } else {
                    console.warn('AccessibilityValidator no está disponible');
                }
            });
        }
        
        // Botón de Performance
        const performanceLink = document.getElementById('performance-link');
        if (performanceLink) {
            performanceLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.PerformanceOptimizer) {
                    const optimizer = new PerformanceOptimizer();
                    optimizer.showPerformanceReport();
                } else {
                    console.warn('PerformanceOptimizer no está disponible');
                }
            });
        }
    },
    
    // Cargar datos iniciales
    loadInitialData: async function() {
        try {
            // Cargar estados
            await this.loadStates();
            
            // Cargar datos del dashboard
            if (this.currentPage === 'dashboard') {
                await window.Dashboard.loadDashboardData();
            }
            
            // Cargar equipos si estamos en esa página
            if (this.currentPage === 'equipment') {
                await window.Equipment.loadEquipmentList();
            }
            
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            ApiUtils.handleError(error, false); // No ejecutar logout automático
        }
    },
    
    // Manejar cambio de hash en URL
    handleHashChange: function() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        this.navigateToPage(hash);
    },
    
    // Navegar a página específica
    navigateToPage: function(pageName) {
        this.currentPage = pageName;
        
        // Actualizar navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });
        
        // Actualizar título de la página
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            const pageLabels = {
                'dashboard': 'Dashboard',
                'equipment': 'Equipos',
                'assignments': 'Asignaciones',
                'reports': 'Reportes',
                'security': 'Seguridad',
                'disposal': 'Propuestas de Baja'
            };
            pageTitle.textContent = pageLabels[pageName] || pageName;
        }
        
        // Mostrar página
        UI.showPage(pageName);
        
        // Cargar datos específicos de la página
        this.loadPageData(pageName);
    },
    
    // Cargar datos específicos de la página
    loadPageData: async function(pageName) {
        try {
            switch (pageName) {
                case 'dashboard':
                    if (window.Dashboard && window.Dashboard.loadDashboardData) {
                        await window.Dashboard.loadDashboardData();
                    } else {
                        console.warn('⚠️ Dashboard no está disponible');
                    }
                    break;
                case 'equipment':
                    // Verificar que Equipment esté disponible y esperar si es necesario                    
                    if (window.Equipment && typeof window.Equipment.init === 'function') {
                        window.Equipment.init();
                    }
                    if (window.Equipment && window.Equipment.loadEquipmentList) {
                        console.log('📊 Cargando equipos desde App.loadPageData...');
                        await window.Equipment.loadEquipmentList();
                    } else {
                        console.warn('⚠️ Equipment no está disponible, esperando inicialización...');
                        // Esperar a que Equipment se inicialice
                        await this.waitForEquipment();
                        if (window.Equipment && window.Equipment.loadEquipmentList) {
                            console.log('📊 Equipment disponible, cargando equipos...');
                            await window.Equipment.loadEquipmentList();
                        } else {
                            console.error('❌ Equipment no se pudo inicializar');
                        }
                    }
                    break;
                case 'assignments':
                    // TODO: Implementar carga de asignaciones
                    break;
                case 'movements':
                    // TODO: Implementar carga de movimientos
                    break;
                case 'security':
                    // TODO: Implementar carga de seguridad
                    break;
                case 'reports':
                    // TODO: Implementar carga de reportes
                    break;
                case 'disposals':
                    // TODO: Implementar carga de propuestas de baja
                    break;
            }
        } catch (error) {
            console.error(`Error cargando datos de ${pageName}:`, error);
            ApiUtils.handleError(error, false); // No ejecutar logout automático
        }
    },
    
    // Esperar a que Equipment esté disponible (event-driven + fallback)
    waitForEquipment: function() {
        return new Promise((resolve) => {
            // Resolución inmediata si ya está listo
            if (window.Equipment && typeof window.Equipment.loadEquipmentList === 'function') {
                return resolve();
            }

            // Escuchar evento explícito de readiness
            const onReady = () => {
                document.removeEventListener('equipment-ready', onReady);
                resolve();
            };
            document.addEventListener('equipment-ready', onReady, { once: true });

            // Fallback con polling y timeout ampliado
            let attempts = 0;
            const maxAttempts = 30; // ~15s a 500ms
            const checkEquipment = () => {
                attempts++;
                if (window.Equipment && typeof window.Equipment.loadEquipmentList === 'function') {
                    document.removeEventListener('equipment-ready', onReady);
                    resolve();
                    return;
                }
                if (attempts >= maxAttempts) {
                    console.warn('⚠️ Equipment no se detectó a tiempo (timeout). Continuando sin bloquear.');
                    document.removeEventListener('equipment-ready', onReady);
                    resolve();
                    return;
                }
                setTimeout(checkEquipment, 500);
            };
            checkEquipment();
        });
    },
    
    // Cargar estados
    loadStates: async function() {
        try {
            const states = await API.states.getAll();
            
            // Llenar select de estados en filtros
            const stateFilter = document.getElementById('equipment-state-filter');
            if (stateFilter) {
                stateFilter.innerHTML = '<option value="">Todos</option>';
                states.forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.id;
                    option.textContent = state.name;
                    stateFilter.appendChild(option);
                });
            }
            
            // Guardar estados en cache
            this.cache.states = states;
            
        } catch (error) {
            console.error('Error cargando estados:', error);
        }
    },
    
    // Manejar cambio de página en paginación
    handlePageChange: function(page) {
        switch (this.currentPage) {
            case 'equipment':
                Equipment.loadEquipment(page);
                break;
            case 'assignments':
                // TODO: Implementar paginación de asignaciones
                break;
            case 'movements':
                // TODO: Implementar paginación de movimientos
                break;
            case 'reports':
                // TODO: Implementar paginación de reportes
                break;
            case 'disposals':
                // TODO: Implementar paginación de propuestas de baja
                break;
        }
    },
    
    // Cache de datos
    cache: {
        states: [],
        equipment: [],
        users: []
    },
    
    // Utilidades de la aplicación
    utils: {
        // Formatear fecha para mostrar
        formatDate: function(dateString) {
            if (!dateString) return 'N/A';
            
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
        formatInventoryNumber: function(number) {
            return number || 'N/A';
        },
        
        // Obtener texto de tipo de equipo
        getEquipmentTypeText: function(type) {
            return CONFIG.EQUIPMENT_TYPES[type] || type;
        },
        
        // Obtener texto de estado de equipo
        getEquipmentStatusText: function(status) {
            return CONFIG.EQUIPMENT_STATUS[status] || status;
        },
        
        // Obtener color de estado
        getStatusColor: function(status) {
            const colors = {
                active: 'success',
                maintenance: 'warning',
                out_of_service: 'danger',
                disposed: 'secondary'
            };
            return colors[status] || 'secondary';
        },
        
        // Validar formulario
        validateForm: function(formData) {
            const errors = {};
            
            // Validar campos requeridos
            Object.keys(formData).forEach(key => {
                if (formData[key] === '' || formData[key] === null || formData[key] === undefined) {
                    errors[key] = 'Este campo es requerido';
                }
            });
            
            // Validaciones específicas
            if (formData.inventory_number && !ConfigUtils.isValidInventoryNumber(formData.inventory_number)) {
                errors.inventory_number = 'El número de inventario debe tener al menos 3 caracteres';
            }
            
            if (formData.email && !ConfigUtils.isValidEmail(formData.email)) {
                errors.email = 'El email no es válido';
            }
            
            return {
                isValid: Object.keys(errors).length === 0,
                errors
            };
        },
        
        // Mostrar errores de formulario
        showFormErrors: function(errors) {
            Object.keys(errors).forEach(fieldName => {
                const field = document.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    UI.showFieldError(field, errors[fieldName]);
                }
            });
        },
        
        // Limpiar errores de formulario
        clearFormErrors: function() {
            const errorFields = document.querySelectorAll('.field-error');
            errorFields.forEach(field => field.remove());
            
            const fields = document.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.style.borderColor = '';
            });
        }
    }
};

// Inicializar aplicación cuando esté autenticado
document.addEventListener('DOMContentLoaded', () => {
    // La aplicación se inicializará cuando Auth.showApp() sea llamado
    console.log('📱 Aplicación lista para inicializar');
    // Inicialización automática de Equipment si el usuario está autenticado y la clase está disponible
    if (window.Auth && window.Auth.isAuthenticated) {
        if (window.Equipment && typeof window.Equipment.init === 'function') {
            window.Equipment.init();
        }
    }
});

// Exportar aplicación
window.App = App; 
