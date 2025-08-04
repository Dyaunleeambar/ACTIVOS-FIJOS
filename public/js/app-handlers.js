/**
 * Manejadores globales para data-action
 * Compatible con Content Security Policy
 */
const AppHandlers = {
    
    // Inicializar todos los event listeners
    init: function() {
        console.log('🔧 Inicializando manejadores globales de la aplicación...');
        this.setupGlobalHandlers();
        console.log('✅ Manejadores globales inicializados correctamente');
    },
    
    // Manejador general para atributos data-action
    setupGlobalHandlers: function() {
        document.addEventListener('click', function(e) {
            const action = e.target.getAttribute('data-action');
            if (!action) return;
            
            e.preventDefault();
            console.log('🔧 Ejecutando acción global:', action);
            
            switch (action) {
                // Navegación de páginas
                case 'show-page':
                    const page = e.target.getAttribute('data-page');
                    if (page && window.UI && window.UI.showPage) {
                        window.UI.showPage(page);
                    } else {
                        console.error('❌ UI.showPage no disponible o página no especificada');
                    }
                    break;
                
                // Acciones de Equipment
                case 'clear-filters':
                    if (window.Equipment && window.Equipment.clearFilters) {
                        window.Equipment.clearFilters();
                    } else {
                        console.error('❌ Equipment.clearFilters no disponible');
                    }
                    break;
                
                case 'show-create-form':
                    if (window.Equipment && window.Equipment.showCreateForm) {
                        window.Equipment.showCreateForm();
                    } else {
                        console.error('❌ Equipment.showCreateForm no disponible');
                    }
                    break;
                
                case 'show-import-modal':
                    if (window.Equipment && window.Equipment.showImportModal) {
                        window.Equipment.showImportModal();
                    } else {
                        console.error('❌ Equipment.showImportModal no disponible');
                    }
                    break;
                
                case 'export-to-excel':
                    if (window.Equipment && window.Equipment.exportToExcel) {
                        window.Equipment.exportToExcel();
                    } else {
                        console.error('❌ Equipment.exportToExcel no disponible');
                    }
                    break;
                
                case 'refresh-list':
                    if (window.Equipment && window.Equipment.refreshList) {
                        window.Equipment.refreshList();
                    } else {
                        console.error('❌ Equipment.refreshList no disponible');
                    }
                    break;
                
                default:
                    console.log('⚠️ Acción global no reconocida:', action);
            }
        });
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM listo, inicializando manejadores globales...');
    AppHandlers.init();
}); 
