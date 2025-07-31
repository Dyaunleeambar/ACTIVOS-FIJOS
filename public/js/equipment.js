// Módulo de Gestión de Equipos
const Equipment = {
    // Estado del módulo
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: CONFIG.DEFAULT_PAGE_SIZE,
    filters: {},
    
    // Inicializar módulo
    init: function() {
        console.log('🖥️ Inicializando módulo de equipos...');
        this.setupEventListeners();
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Filtros
        const filterInputs = document.querySelectorAll('#equipment-type-filter, #equipment-status-filter, #equipment-state-filter');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilters();
            });
        });
        
        // Paginación
        document.addEventListener('click', (e) => {
            if (e.target.matches('#prev-page-btn')) {
                e.preventDefault();
                this.loadEquipment(this.currentPage - 1);
            }
            
            if (e.target.matches('#next-page-btn')) {
                e.preventDefault();
                this.loadEquipment(this.currentPage + 1);
            }
        });
    },
    
    // Cargar equipos
    loadEquipment: async function(page = 1) {
        try {
            console.log('🔄 Cargando equipos...');
            
            // Mostrar loading
            UI.showLoading('#equipment-page', 'Cargando equipos...');
            
            // Obtener filtros
            this.updateFilters();
            
            // Construir parámetros
            const params = {
                page: page,
                limit: this.itemsPerPage,
                ...this.filters
            };
            
            // Llamar API
            const response = await API.equipment.getAll(params);
            
            // Actualizar estado
            this.currentPage = response.pagination.page;
            this.totalPages = response.pagination.pages;
            this.totalItems = response.pagination.total;
            
            // Renderizar tabla
            this.renderEquipmentTable(response.equipment);
            
            // Actualizar paginación
            this.updatePagination();
            
            // Ocultar loading
            UI.hideLoading('#equipment-page');
            
            console.log('✅ Equipos cargados exitosamente');
            
        } catch (error) {
            console.error('Error cargando equipos:', error);
            UI.hideLoading('#equipment-page');
            UI.showError('#equipment-page', 'Error cargando equipos');
            ApiUtils.handleError(error);
        }
    },
    
    // Actualizar filtros
    updateFilters: function() {
        this.filters = {
            type: document.getElementById('equipment-type-filter')?.value || '',
            status: document.getElementById('equipment-status-filter')?.value || '',
            state_id: document.getElementById('equipment-state-filter')?.value || ''
        };
        
        // Limpiar valores vacíos
        Object.keys(this.filters).forEach(key => {
            if (!this.filters[key]) {
                delete this.filters[key];
            }
        });
    },
    
    // Renderizar tabla de equipos
    renderEquipmentTable: function(equipment) {
        const tbody = document.getElementById('equipment-tbody');
        if (!tbody) return;
        
        if (equipment.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-desktop"></i>
                            <h3>No hay equipos</h3>
                            <p>No se encontraron equipos con los filtros aplicados</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = equipment.map(item => `
            <tr data-id="${item.id}">
                <td>${App.utils.formatInventoryNumber(item.inventory_number)}</td>
                <td>${item.name}</td>
                <td>${App.utils.getEquipmentTypeText(item.type)}</td>
                <td>${item.brand || ''} ${item.model || ''}</td>
                <td>
                    <span class="status-badge ${item.status}">
                        ${App.utils.getEquipmentStatusText(item.status)}
                    </span>
                </td>
                <td>${item.state_name || 'N/A'}</td>
                <td>${item.assigned_user_name || 'No asignado'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-icon" onclick="Equipment.viewEquipment(${item.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${Auth.hasPermission('manager') ? `
                            <button class="btn btn-sm btn-icon" onclick="Equipment.editEquipment(${item.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        ${Auth.hasPermission('admin') ? `
                            <button class="btn btn-sm btn-icon" onclick="Equipment.deleteEquipment(${item.id})" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    // Actualizar paginación
    updatePagination: function() {
        const infoElement = document.getElementById('pagination-info');
        const prevBtn = document.getElementById('prev-page-btn');
        const nextBtn = document.getElementById('next-page-btn');
        const pageNumbers = document.getElementById('page-numbers');
        
        if (infoElement) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
            infoElement.textContent = `Mostrando ${start}-${end} de ${this.totalItems} registros`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }
        
        if (pageNumbers) {
            pageNumbers.innerHTML = UI.createPagination(
                this.currentPage,
                this.totalPages,
                (page) => this.loadEquipment(page)
            );
        }
    },
    
    // Mostrar modal de crear equipo
    showCreateModal: function() {
        const modalContent = `
            <div class="form-container">
                <form id="create-equipment-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="inventory_number">
                                <i class="fas fa-barcode"></i>
                                Número de Inventario *
                            </label>
                            <input type="text" id="inventory_number" name="inventory_number" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="name">
                                <i class="fas fa-tag"></i>
                                Nombre del Equipo *
                            </label>
                            <input type="text" id="name" name="name" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="type">
                                <i class="fas fa-desktop"></i>
                                Tipo de Equipo *
                            </label>
                            <select id="type" name="type" required>
                                <option value="">Seleccionar tipo</option>
                                ${Object.entries(CONFIG.EQUIPMENT_TYPES).map(([key, value]) => 
                                    `<option value="${key}">${value}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="state_id">
                                <i class="fas fa-map-marker-alt"></i>
                                Estado *
                            </label>
                            <select id="state_id" name="state_id" required>
                                <option value="">Seleccionar estado</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="brand">
                                <i class="fas fa-industry"></i>
                                Marca
                            </label>
                            <input type="text" id="brand" name="brand">
                        </div>
                        
                        <div class="form-group">
                            <label for="model">
                                <i class="fas fa-cube"></i>
                                Modelo
                            </label>
                            <input type="text" id="model" name="model">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="specifications">
                            <i class="fas fa-info-circle"></i>
                            Especificaciones
                        </label>
                        <textarea id="specifications" name="specifications" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="location_details">
                            <i class="fas fa-map-pin"></i>
                            Detalles de Ubicación
                        </label>
                        <textarea id="location_details" name="location_details" rows="2"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            Crear Equipo
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        UI.showModal('Crear Nuevo Equipo', modalContent);
        
        // Llenar select de estados
        this.populateStateSelect();
        
        // Configurar event listener del formulario
        const form = document.getElementById('create-equipment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateEquipment();
            });
        }
    },
    
    // Llenar select de estados
    populateStateSelect: function() {
        const stateSelect = document.getElementById('state_id');
        if (stateSelect && App.cache.states) {
            stateSelect.innerHTML = '<option value="">Seleccionar estado</option>';
            App.cache.states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.id;
                option.textContent = state.name;
                stateSelect.appendChild(option);
            });
        }
    },
    
    // Manejar creación de equipo
    handleCreateEquipment: async function() {
        try {
            const form = document.getElementById('create-equipment-form');
            const formData = new FormData(form);
            
            // Convertir FormData a objeto
            const equipmentData = {};
            formData.forEach((value, key) => {
                equipmentData[key] = value;
            });
            
            // Validar formulario
            const validation = App.utils.validateForm(equipmentData);
            if (!validation.isValid) {
                App.utils.showFormErrors(validation.errors);
                return;
            }
            
            // Limpiar errores
            App.utils.clearFormErrors();
            
            // Mostrar loading
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';
            submitBtn.disabled = true;
            
            // Llamar API
            const response = await API.equipment.create(equipmentData);
            
            // Mostrar notificación de éxito
            UI.showNotification('Equipo creado exitosamente', 'success');
            
            // Cerrar modal
            UI.closeModal();
            
            // Recargar equipos
            this.loadEquipment();
            
        } catch (error) {
            console.error('Error creando equipo:', error);
            ApiUtils.handleError(error);
        } finally {
            // Restaurar botón
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },
    
    // Ver equipo
    viewEquipment: async function(id) {
        try {
            const equipment = await API.equipment.getById(id);
            
            const modalContent = `
                <div class="equipment-details">
                    <div class="detail-row">
                        <strong>Número de Inventario:</strong>
                        <span>${equipment.inventory_number}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Nombre:</strong>
                        <span>${equipment.name}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Tipo:</strong>
                        <span>${App.utils.getEquipmentTypeText(equipment.type)}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Estado:</strong>
                        <span class="status-badge ${equipment.status}">
                            ${App.utils.getEquipmentStatusText(equipment.status)}
                        </span>
                    </div>
                    <div class="detail-row">
                        <strong>Ubicación:</strong>
                        <span>${equipment.state_name || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <strong>Asignado a:</strong>
                        <span>${equipment.assigned_user_name || 'No asignado'}</span>
                    </div>
                    ${equipment.brand ? `
                        <div class="detail-row">
                            <strong>Marca:</strong>
                            <span>${equipment.brand}</span>
                        </div>
                    ` : ''}
                    ${equipment.model ? `
                        <div class="detail-row">
                            <strong>Modelo:</strong>
                            <span>${equipment.model}</span>
                        </div>
                    ` : ''}
                    ${equipment.specifications ? `
                        <div class="detail-row">
                            <strong>Especificaciones:</strong>
                            <span>${equipment.specifications}</span>
                        </div>
                    ` : ''}
                    ${equipment.location_details ? `
                        <div class="detail-row">
                            <strong>Detalles de Ubicación:</strong>
                            <span>${equipment.location_details}</span>
                        </div>
                    ` : ''}
                </div>
            `;
            
            UI.showModal('Detalles del Equipo', modalContent);
            
        } catch (error) {
            console.error('Error cargando detalles del equipo:', error);
            ApiUtils.handleError(error);
        }
    },
    
    // Editar equipo
    editEquipment: function(id) {
        // TODO: Implementar edición de equipo
        UI.showNotification('Edición de equipos en desarrollo', 'info');
    },
    
    // Eliminar equipo
    deleteEquipment: function(id) {
        UI.confirm(
            '¿Está seguro de que desea eliminar este equipo? Esta acción no se puede deshacer.',
            () => this.handleDeleteEquipment(id)
        );
    },
    
    // Manejar eliminación de equipo
    handleDeleteEquipment: async function(id) {
        try {
            await API.equipment.delete(id);
            
            UI.showNotification('Equipo eliminado exitosamente', 'success');
            
            // Recargar equipos
            this.loadEquipment();
            
        } catch (error) {
            console.error('Error eliminando equipo:', error);
            ApiUtils.handleError(error);
        }
    }
};

// Inicializar módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Equipment.init();
});

// Exportar módulo de equipos
window.Equipment = Equipment; 
