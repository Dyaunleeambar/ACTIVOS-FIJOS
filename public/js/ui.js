// Módulo de Utilidades de UI
const UI = {
    // Inicializar UI
    init: function() {
        this.setupEventListeners();
        this.setupResponsive();
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarFloating = document.getElementById('sidebar-floating');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const sidebarClose = document.getElementById('sidebar-close');
        
        if (sidebarToggle && sidebarFloating) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        
        // Navigation
        this.setupNavigation();
        
        // Modal
        this.setupModal();
        
        // Notifications
        this.setupNotifications();
    },
    
    // Configurar navegación
    setupNavigation: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        const pageTitle = document.getElementById('page-title');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remover clase active de todos los links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Agregar clase active al link clickeado
                link.classList.add('active');
                
                // Obtener página
                const page = link.getAttribute('data-page');
                
                // Cambiar página
                this.showPage(page);
                
                // Actualizar título
                if (pageTitle) {
                    // Obtener el texto del enlace (excluyendo el ícono)
                    const linkText = link.textContent.trim();
                    pageTitle.textContent = linkText;
                }
                
                // Cerrar sidebar en móvil
                if (window.innerWidth <= 768) {
                    const sidebar = document.querySelector('.app-sidebar');
                    if (sidebar) {
                        sidebar.classList.remove('active');
                    }
                }
            });
        });
    },
    
    // Mostrar página específica
    showPage: function(pageName) {
        // Ocultar todas las páginas
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => page.classList.remove('active'));
        
        // Mostrar página seleccionada
        const targetPage = document.getElementById(pageName + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
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
        
        // Actualizar URL hash
        window.location.hash = pageName;
    },
    
    // Configurar modal
    setupModal: function() {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeSidebar();
            }
        });
    },
    
    // Mostrar modal
    showModal: function(title, content) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        if (modalOverlay) modalOverlay.style.display = 'flex';
        
        // Enfocar primer input del modal
        setTimeout(() => {
            const firstInput = modalBody.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    },
    
    // Cerrar modal
    closeModal: function() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
            // Remover clase de confirmación
            modalOverlay.classList.remove('modal-confirmation');
        }
    },
    
    // Configurar notificaciones
    setupNotifications: function() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('notifications-container')) {
            const container = document.createElement('div');
            container.id = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 80px; /* Below header */
                right: 20px; /* Right side positioning */
                z-index: 2002;
                max-width: 400px;
                width: auto;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    },
    
    // Mostrar notificación
    showNotification: function(message, type = 'info', duration = CONFIG.NOTIFICATION_TIMEOUT) {
        const container = document.getElementById('notifications-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${this.getNotificationTitle(type)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        container.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Ocultar automáticamente
        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }
        
        return notification;
    },
    
    // Ocultar notificación
    hideNotification: function(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    },
    
    // Obtener título de notificación
    getNotificationTitle: function(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || 'Notificación';
    },
    
    // Toggle sidebar
    toggleSidebar: function() {
        const sidebarFloating = document.getElementById('sidebar-floating');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (sidebarFloating && sidebarOverlay) {
            sidebarFloating.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            
            // Bloquear scroll del body cuando sidebar está abierto
            if (sidebarFloating.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },
    
    // Cerrar sidebar
    closeSidebar: function() {
        const sidebarFloating = document.getElementById('sidebar-floating');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (sidebarFloating && sidebarOverlay) {
            sidebarFloating.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // Configurar responsive
    setupResponsive: function() {
        window.addEventListener('resize', ConfigUtils.debounce(() => {
            this.handleResize();
        }, 250));
        
        this.handleResize();
    },
    
    // Manejar resize
    handleResize: function() {
        const sidebarFloating = document.getElementById('sidebar-floating');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        // Cerrar sidebar en pantallas grandes si está abierto
        if (window.innerWidth > 768 && sidebarFloating && sidebarFloating.classList.contains('active')) {
            this.closeSidebar();
        }
    },
    
    // Mostrar loading
    showLoading: function(container, message = 'Cargando...') {
        const loadingHtml = `
            <div class="loading-overlay">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.style.position = 'relative';
            container.insertAdjacentHTML('beforeend', loadingHtml);
        }
    },
    
    // Ocultar loading
    hideLoading: function(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            const loadingOverlay = container.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }
    },
    
    // Mostrar error
    showError: function(container, message, icon = 'fas fa-exclamation-triangle') {
        const errorHtml = `
            <div class="error-state">
                <i class="${icon}"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo"></i>
                    Reintentar
                </button>
            </div>
        `;
        
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = errorHtml;
        }
    },
    
    // Mostrar estado vacío
    showEmptyState: function(container, message, icon = 'fas fa-inbox') {
        const emptyHtml = `
            <div class="empty-state">
                <i class="${icon}"></i>
                <h3>Sin datos</h3>
                <p>${message}</p>
            </div>
        `;
        
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = emptyHtml;
        }
    },
    
    // Confirmar acción
    confirm: function(message, callback) {
        const modalContent = `
            <div class="text-center">
                <i class="fas fa-question-circle" style="font-size: 48px; color: #667eea; margin-bottom: 20px;"></i>
                <h3>Confirmar Acción</h3>
                <p>${message}</p>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-danger" onclick="UI.closeModal(); ${callback}()">
                        <i class="fas fa-check"></i>
                        Confirmar
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('Confirmar', modalContent);
    },

    // Mostrar diálogo de confirmación (versión async)
    showConfirmDialog: function(title, message) {
        console.log('🔍 showConfirmDialog llamado con:', { title, message });
        
        return new Promise((resolve) => {
            const modalContent = `
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f59e0b; margin-bottom: 20px;"></i>
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="form-actions" style="margin-top: 20px;">
                        <button type="button" class="btn btn-secondary" id="cancel-delete-btn" style="margin-right: 10px;">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-danger" id="confirm-delete-btn">
                            <i class="fas fa-trash"></i>
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
            
            console.log('✅ Mostrando modal de confirmación...');
            this.showModal('Confirmar Eliminación', modalContent);
            
            // Agregar clase CSS para estilos específicos
            const modalOverlay = document.getElementById('modal-overlay');
            if (modalOverlay) {
                modalOverlay.classList.add('modal-confirmation');
            }
            
            // Agregar event listeners a los botones
            setTimeout(() => {
                const cancelBtn = document.getElementById('cancel-delete-btn');
                const confirmBtn = document.getElementById('confirm-delete-btn');
                
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => {
                        console.log('🔍 Usuario canceló la eliminación');
                        this.closeModal();
                        resolve(false);
                    });
                }
                
                if (confirmBtn) {
                    confirmBtn.addEventListener('click', () => {
                        console.log('🔍 Usuario confirmó la eliminación');
                        this.closeModal();
                        resolve(true);
                    });
                }
            }, 100);
        });
    },
    
    // Validar formulario
    validateForm: function(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'Este campo es requerido');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });
        
        return isValid;
    },
    
    // Mostrar error de campo
    showFieldError: function(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 4px;';
        errorDiv.textContent = message;
        
        field.style.borderColor = '#dc3545';
        field.parentNode.appendChild(errorDiv);
    },
    
    // Limpiar error de campo
    clearFieldError: function(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    },
    
    // Formatear tabla
    formatTable: function(data, columns, options = {}) {
        let html = '<table class="data-table">';
        
        // Header
        html += '<thead><tr>';
        columns.forEach(column => {
            html += `<th>${column.title}</th>`;
        });
        html += '</tr></thead>';
        
        // Body
        html += '<tbody>';
        if (data.length === 0) {
            html += `<tr><td colspan="${columns.length}" class="text-center">No hay datos disponibles</td></tr>`;
        } else {
            data.forEach(row => {
                html += '<tr>';
                columns.forEach(column => {
                    let value = row[column.key];
                    
                    // Formatear valor según el tipo
                    if (column.format) {
                        value = column.format(value, row);
                    }
                    
                    html += `<td>${value}</td>`;
                });
                html += '</tr>';
            });
        }
        html += '</tbody></table>';
        
        return html;
    },
    
    // Crear paginación
    createPagination: function(currentPage, totalPages, onPageChange) {
        let html = '<div class="pagination-controls">';
        
        // Botón anterior
        html += `<button class="btn btn-secondary" ${currentPage <= 1 ? 'disabled' : ''} onclick="onPageChange(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Anterior
        </button>`;
        
        // Números de página
        html += '<div id="page-numbers">';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<span class="page-number ${i === currentPage ? 'active' : ''}" onclick="onPageChange(${i})">${i}</span>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += '<span>...</span>';
            }
        }
        html += '</div>';
        
        // Botón siguiente
        html += `<button class="btn btn-secondary" ${currentPage >= totalPages ? 'disabled' : ''} onclick="onPageChange(${currentPage + 1})">
            Siguiente <i class="fas fa-chevron-right"></i>
        </button>`;
        
        html += '</div>';
        
        return html;
    }
};

// Inicializar UI cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});

// Exportar módulo de UI
window.UI = UI; 
