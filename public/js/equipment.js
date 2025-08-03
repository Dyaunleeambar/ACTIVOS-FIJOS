/**
 * Equipment Module - Sistema de Gestión de Medios Informáticos
 * Maneja toda la funcionalidad relacionada con equipos
 */

class Equipment {
    constructor() {
        this.equipment = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.filters = {
            search: '',
            type: '',
            status: '',
            state: ''
        };
        this.currentStep = 1;
        this.importData = null;
        this.validationResults = null;
        this.columnMapping = {};
        
        // Mapeo de estados string a números
        this.stateMapping = {
            'direccion': 1,
            'capital': 2,
            'carabobo': 3,
            'barinas': 4,
            'anzoategui': 5,
            'bolivar': 6,
            'zulia': 7
        };
    }

    // Helper para convertir estado string a número
    getStateId(stateString) {
        return this.stateMapping[stateString] || null;
    }

    // Helper para convertir número a estado string
    getStateString(stateId) {
        for (const [key, value] of Object.entries(this.stateMapping)) {
            if (value === stateId) {
                return key;
            }
        }
        return null;
    }

    // Inicializar
    init() {
        this.setupEventListeners();
        this.loadFilterData();
        this.loadEquipmentList();
    }

    setupEventListeners() {
        // Nuevos event listeners para filtros compactos (incluye búsqueda)
        this.setupCompactFilters();
        
        // Event listeners para botones
        const newEquipmentBtn = document.getElementById('new-equipment-btn');
        if (newEquipmentBtn) {
            newEquipmentBtn.addEventListener('click', () => this.showCreateForm());
        }

        const importBtn = document.getElementById('import-equipment-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportModal());
        }

        const exportBtn = document.getElementById('export-equipment-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToExcel());
        }
    }

    // Nueva función para configurar filtros compactos
    setupCompactFilters() {
        // Búsqueda (ahora en la sección de filtros)
        const searchInput = document.getElementById('search-equipment');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.filters.search = searchInput.value;
                this.currentPage = 1;
                this.loadEquipmentList();
                this.updateActiveFilters();
            }, 300));
        }

        // Filtro combinado Tipo + Estado
        const filterTypeStatus = document.getElementById('filter-type-status');
        if (filterTypeStatus) {
            filterTypeStatus.addEventListener('change', (e) => {
                const value = e.target.value;
                if (value.startsWith('type:')) {
                    this.filters.type = value.replace('type:', '');
                    this.filters.status = '';
                } else if (value.startsWith('status:')) {
                    this.filters.status = value.replace('status:', '');
                    this.filters.type = '';
                } else {
                    this.filters.type = '';
                    this.filters.status = '';
                }
                    this.currentPage = 1;
                    this.loadEquipmentList();
                this.updateActiveFilters();
            });
        }

        // Filtro de Estado/Región
        const filterState = document.getElementById('filter-state');
        if (filterState) {
            filterState.addEventListener('change', (e) => {
                this.filters.state = e.target.value;
                this.currentPage = 1;
                this.loadEquipmentList();
                this.updateActiveFilters();
            });
        }
    }

    // Función para actualizar chips de filtros activos
    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        if (!activeFiltersContainer) return;

        activeFiltersContainer.innerHTML = '';

        const activeFilters = [];

        // Agregar filtros activos
        if (this.filters.search) {
            activeFilters.push({
                type: 'search',
                label: `Búsqueda: "${this.filters.search}"`,
                value: this.filters.search
            });
        }

        if (this.filters.type) {
            const typeLabel = this.getTypeLabel(this.filters.type);
            activeFilters.push({
                type: 'type',
                label: `Tipo: ${typeLabel}`,
                value: this.filters.type
            });
        }

        if (this.filters.status) {
            const statusLabel = this.getStatusLabel(this.filters.status);
            activeFilters.push({
                type: 'status',
                label: `Estado: ${statusLabel}`,
                value: this.filters.status
            });
        }

        if (this.filters.state) {
            // Obtener el nombre del estado desde el select
            const stateSelect = document.getElementById('filter-state');
            let stateLabel = this.filters.state;
            if (stateSelect) {
                const selectedOption = stateSelect.querySelector(`option[value="${this.filters.state}"]`);
                if (selectedOption) {
                    stateLabel = selectedOption.textContent;
                }
            }
            activeFilters.push({
                type: 'state',
                label: `Ubicación: ${stateLabel}`,
                value: this.filters.state
            });
        }

        // Crear chips para cada filtro activo
        activeFilters.forEach(filter => {
            const chip = document.createElement('div');
            chip.className = 'filter-chip';
            chip.innerHTML = `
                <span>${filter.label}</span>
                <button class="remove-chip" onclick="Equipment.removeFilter('${filter.type}')" title="Remover filtro">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(chip);
        });
    }

    // Función para remover filtros individuales
    removeFilter(filterType) {
        switch (filterType) {
            case 'search':
                this.filters.search = '';
                const searchInput = document.getElementById('search-equipment');
                if (searchInput) searchInput.value = '';
                break;
            case 'type':
                this.filters.type = '';
                const typeSelect = document.getElementById('filter-type-status');
                if (typeSelect) typeSelect.value = '';
                break;
            case 'status':
                this.filters.status = '';
                const statusSelect = document.getElementById('filter-type-status');
                if (statusSelect) statusSelect.value = '';
                break;
            case 'state':
                this.filters.state = '';
                const stateSelect = document.getElementById('filter-state');
                if (stateSelect) stateSelect.value = '';
                break;
        }
        
        this.currentPage = 1;
        this.loadEquipmentList();
        this.updateActiveFilters();
    }

    // Función para limpiar todos los filtros
    clearFilters() {
        this.filters = {
            search: '',
            type: '',
            status: '',
            state: ''
        };
        this.currentPage = 1;

        // Limpiar inputs
        const searchInput = document.getElementById('search-equipment');
        if (searchInput) searchInput.value = '';

        const typeStatusSelect = document.getElementById('filter-type-status');
        if (typeStatusSelect) typeStatusSelect.value = '';

        const stateSelect = document.getElementById('filter-state');
        if (stateSelect) stateSelect.value = '';

        this.loadEquipmentList();
        this.updateActiveFilters();
    }

    // Cargar lista de equipos
    async loadEquipmentList(showErrors = true) {
        try {
            const tbody = document.getElementById('equipment-tbody');
            const countElement = document.getElementById('equipment-count');
            
            // Mostrar loading
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando equipos...</td></tr>';
            
            // Construir parámetros de filtro con mapeo de estados
            const filterParams = { ...this.filters };
            if (filterParams.state) {
                const stateId = this.getStateId(filterParams.state);
                if (stateId) {
                    filterParams.state_id = stateId;
                    delete filterParams.state; // Eliminar el string y usar el número
                }
            }
            
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.itemsPerPage,
                ...filterParams
            });

            console.log('🔍 Cargando equipos con parámetros:', params.toString());

            const response = await API.get(`/equipment?${params}`);
            
            console.log('✅ Respuesta del servidor:', response);
            
            if (response.equipment) {
                this.renderEquipmentTable(response.equipment);
                this.renderPagination(response.pagination);
                this.updateEquipmentCount(response.pagination.total);
                     this.updateActiveFilters(); // Actualizar chips de filtros activos
            } else {
                     console.warn('⚠️ Respuesta sin datos de equipos:', response);
                     // Si no hay equipos, mostrar tabla vacía
                     this.renderEquipmentTable([]);
                     this.updateActiveFilters(); // Actualizar chips de filtros activos
            }
        } catch (error) {
            console.error('❌ Error cargando equipos:', error);
            
            // Solo mostrar error al usuario si showErrors es true
            if (showErrors) {
                // Mostrar error más específico
                let errorMessage = 'Error cargando equipos';
                if (error.message.includes('500')) {
                    errorMessage = 'Error interno del servidor al cargar equipos';
                } else if (error.message.includes('401')) {
                    errorMessage = 'Sesión expirada';
                } else if (error.message.includes('403')) {
                    errorMessage = 'Sin permisos para ver equipos';
                }
                
                UI.showNotification(errorMessage, 'error');
            }
            
            this.renderEquipmentTable([]);
        }
    }

    // Renderizar tabla de equipos
    renderEquipmentTable(equipment) {
        const tbody = document.getElementById('equipment-tbody');
        
        if (!equipment || equipment.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div style="padding: 40px;">
                            <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                            <p>No se encontraron equipos</p>
                            <button class="btn btn-secondary" onclick="Equipment.showCreateForm()">
                                <i class="fas fa-plus"></i> Agregar primer equipo
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = equipment.map(item => `
            <tr>
                <td>
                    <strong>${item.inventory_number}</strong>
                </td>
                <td>
                    <div>
                        <div style="font-weight: 500;">${item.name}</div>
                        <small style="color: #666;">${item.brand || ''} ${item.model || ''}</small>
                    </div>
                </td>
                <td>
                    <span class="type-badge">${this.getTypeLabel(item.type)}</span>
                </td>
                <td>
                    <span class="status-badge status-${item.status}">
                        <i class="fas ${this.getStatusIcon(item.status)}"></i>
                        ${this.getStatusLabel(item.status)}
                    </span>
                </td>
                <td>
                    <div>
                        <div>${item.state_name || 'N/A'}</div>
                    </div>
                </td>
                <td>
                    ${item.assigned_to || '<span style="color: #999;">Sin asignar</span>'}
                </td>
                <td>
                    <div class="table-actions-cell">
                        <button class="action-btn view" onclick="Equipment.viewEquipment(${item.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="Equipment.showCreateForm(${item.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteEquipmentGlobal(${item.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Renderizar paginación
    renderPagination(pagination) {
        const paginationElement = document.getElementById('equipment-pagination');
        
        if (!pagination || pagination.totalPages <= 1) {
            paginationElement.innerHTML = '';
            return;
        }

        const { currentPage, totalPages, total } = pagination;
        
        let paginationHTML = `
            <div class="pagination-info">
                Mostrando ${((currentPage - 1) * this.itemsPerPage) + 1} - ${Math.min(currentPage * this.itemsPerPage, total)} de ${total} equipos
            </div>
        `;

        // Botón anterior
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="Equipment.goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Números de página
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="Equipment.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // Botón siguiente
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="Equipment.goToPage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationElement.innerHTML = paginationHTML;
    }

    // Ir a página específica
    goToPage(page) {
        this.currentPage = page;
        this.loadEquipmentList();
    }

    // Actualizar contador de equipos
    updateEquipmentCount(total) {
        const countElement = document.getElementById('equipment-count');
        if (countElement) {
            countElement.textContent = total;
        }
    }

    // Cargar datos para filtros
    async loadFilterData() {
        try {
            // Los estados ahora son valores fijos, no necesitamos cargarlos desde la API
            const stateSelect = document.getElementById('filter-state');
            if (stateSelect) {
                stateSelect.innerHTML = '<option value="">Todos los estados/regiones</option>';
                const states = [
                    { id: 'direccion', name: 'Dirección' },
                    { id: 'capital', name: 'Capital' },
                    { id: 'carabobo', name: 'Carabobo' },
                    { id: 'barinas', name: 'Barinas' },
                    { id: 'anzoategui', name: 'Anzoátegui' },
                    { id: 'bolivar', name: 'Bolívar' },
                    { id: 'zulia', name: 'Zulia' }
                ];
                states.forEach(state => {
                    stateSelect.innerHTML += `<option value="${state.id}">${state.name}</option>`;
                });
            }
        } catch (error) {
            console.error('Error cargando datos de filtros:', error);
        }
    }

    // Cargar estadísticas de tipos de equipos
    async loadEquipmentStats() {
        try {
            const response = await API.get('/equipment/stats');
            
            if (response.success) {
                this.updateEquipmentStats(response.data);
            } else {
                // Si no hay datos del backend, usar datos mock
                this.updateEquipmentStats({
                    laptops: 8,
                    pcs: 12,
                    monitors: 15,
                    printers: 5,
                    sims: 20,
                    radios: 10
                });
            }
        } catch (error) {
            console.error('Error cargando estadísticas de equipos:', error);
            // Usar datos mock en caso de error
            this.updateEquipmentStats({
                laptops: 8,
                pcs: 12,
                monitors: 15,
                printers: 5,
                sims: 20,
                radios: 10
            });
        }
    }

    // Actualizar estadísticas de equipos en la UI
    updateEquipmentStats(stats) {
        const elements = {
            'equipment-laptops': stats.laptops || 0,
            'equipment-pcs': stats.pcs || 0,
            'equipment-monitors': stats.monitors || 0,
            'equipment-printers': stats.printers || 0,
            'equipment-sims': stats.sims || 0,
            'equipment-radios': stats.radios || 0
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    }

    // Mostrar formulario de creación/edición
    async showCreateForm(equipmentId = null) {
        console.log('🔍 showCreateForm llamado con equipmentId:', equipmentId);
        
        // Crear modal dinámico mejorado
        this.showModalDynamically(equipmentId);
        
        console.log('✅ showCreateForm completado');
    }

    // Función mejorada para mostrar modal dinámicamente
    showModalDynamically(equipmentId) {
        console.log('🔍 showModalDynamically llamado con equipmentId:', equipmentId);
        
        // Crear un nuevo modal completamente independiente
        const dynamicModal = document.createElement('div');
        dynamicModal.id = 'dynamic-equipment-modal';
        dynamicModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
        `;
        
        // Crear el contenido del modal desde cero
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            z-index: 10000000;
            padding: 0;
        `;
        
        // Crear contenido del modal mejorado
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; border-bottom: 1px solid #e1e5e9; background: #f8fafc; border-radius: 12px 12px 0 0;">
                <h2 id="dynamic-modal-title" style="margin: 0; color: #333; font-size: 20px; font-weight: 600;">${equipmentId ? 'Editar Equipo' : 'Nuevo Equipo'}</h2>
                <button id="dynamic-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; border-radius: 6px; transition: all 0.2s ease;">&times;</button>
            </div>
            <form id="dynamic-equipment-form" style="padding: 32px; display: grid; gap: 24px;">
                <!-- Información Básica -->
                <div style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; background: #f8fafc;">
                    <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 8px;">
                        <span style="width: 4px; height: 16px; background: #3b82f6; border-radius: 2px;"></span>
                        Información Básica
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Número de Inventario *</label>
                            <input type="text" name="inventory_number" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Nombre del Equipo *</label>
                            <input type="text" name="name" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Tipo *</label>
                            <select name="type" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                                <option value="">Seleccionar tipo</option>
                                <option value="desktop">Desktop</option>
                                <option value="laptop">Laptop</option>
                                <option value="printer">Impresora</option>
                                <option value="server">Servidor</option>
                                <option value="router">Router</option>
                                <option value="switch">Switch</option>
                                <option value="radio_communication">Radio Comunicación</option>
                                <option value="sim_chip">Chip SIM</option>
                                <option value="roaming">Roaming</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Estado *</label>
                            <select name="status" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                                <option value="active">Activo</option>
                                <option value="maintenance">Mantenimiento</option>
                                <option value="out_of_service">Fuera de servicio</option>
                                <option value="disposed">Desechado</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Información Técnica -->
                <div style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; background: #f8fafc;">
                    <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 8px;">
                        <span style="width: 4px; height: 16px; background: #3b82f6; border-radius: 2px;"></span>
                        Información Técnica
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Marca</label>
                            <input type="text" name="brand" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Modelo</label>
                            <input type="text" name="model" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Especificaciones</label>
                        <textarea name="specifications" rows="3" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease; resize: vertical;"></textarea>
                    </div>
                </div>
                
                <!-- Ubicación y Asignación -->
                <div style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; background: #f8fafc;">
                    <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 8px;">
                        <span style="width: 4px; height: 16px; background: #3b82f6; border-radius: 2px;"></span>
                        Ubicación y Asignación
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Estado/Región *</label>
                            <select name="state_id" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                                <option value="">Seleccionar estado</option>
                                <!-- Los estados se cargarán dinámicamente -->
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Responsable del Equipo *</label>
                            <input type="text" name="assigned_to" required placeholder="Nombre de la persona responsable" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Detalles de Ubicación *</label>
                        <textarea name="location_details" required rows="2" placeholder="Especificaciones adicionales de ubicación" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease; resize: vertical;"></textarea>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end; padding: 24px; border-top: 1px solid #e1e5e9; background: #f8fafc; border-radius: 0 0 12px 12px; margin-top: 24px;">
                    <button type="button" id="dynamic-cancel-btn" style="padding: 12px 24px; border: 2px solid #e1e5e9; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">Cancelar</button>
                    <button type="submit" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                        <i class="fas fa-save" style="margin-right: 8px;"></i>Guardar Equipo
                    </button>
                </div>
            </form>
        `;
        
        // Agregar event listeners mejorados
        const closeBtn = modalContent.querySelector('#dynamic-close-btn');
        const cancelBtn = modalContent.querySelector('#dynamic-cancel-btn');
        const form = modalContent.querySelector('#dynamic-equipment-form');
        
        closeBtn.onclick = () => this.closeDynamicModal();
        cancelBtn.onclick = () => this.closeDynamicModal();
        
        // Mejorar focus y hover states
        const inputs = modalContent.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#3b82f6';
                input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#e1e5e9';
                input.style.boxShadow = 'none';
            });
        });
        
        form.onsubmit = (e) => {
            e.preventDefault();
            this.saveDynamicEquipment(form, equipmentId);
        };
        
        // Agregar overlay para cerrar al hacer clic fuera
        dynamicModal.onclick = (e) => {
            if (e.target === dynamicModal) {
                this.closeDynamicModal();
            }
        };
        
        // Agregar al body
        document.body.appendChild(dynamicModal);
        dynamicModal.appendChild(modalContent);
        
        // Guardar referencia para poder cerrarlo
        this.dynamicModal = dynamicModal;
        
        // Cargar estados dinámicamente
        this.loadStatesForModal();
        
        // Cargar datos si es edición
        if (equipmentId) {
            this.loadEquipmentDataForDynamicModal(equipmentId);
        }
        
        console.log('🚀 Modal dinámico mejorado creado y mostrado');
    }

    // Cargar datos del equipo para el modal dinámico
    async loadEquipmentDataForDynamicModal(equipmentId) {
        try {
            const response = await API.get(`/equipment/${equipmentId}`);
            if (response.equipment) {
                const equipment = response.equipment;
                const form = document.getElementById('dynamic-equipment-form');
                
                // Llenar formulario con datos del equipo
                Object.keys(equipment).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = equipment[key] || '';
                    }
                });
            }
        } catch (error) {
            console.error('Error cargando datos del equipo:', error);
            UI.showNotification('Error cargando datos del equipo', 'error');
        }
    }

    // Guardar equipo desde el modal dinámico mejorado
    async saveDynamicEquipment(form, equipmentId = null) {
        try {
            const formData = new FormData(form);
            
            // Validación básica
            const requiredFields = ['inventory_number', 'name', 'type', 'status', 'state_id', 'assigned_to', 'location_details'];
            const missingFields = [];
            
            requiredFields.forEach(field => {
                if (!formData.get(field)) {
                    missingFields.push(field);
                }
            });
            
            if (missingFields.length > 0) {
                UI.showNotification('Por favor complete todos los campos requeridos', 'error');
                return;
            }
            
            // Procesar valores correctamente
            const stateIdValue = formData.get('state_id');
            const assignedToValue = formData.get('assigned_to');
            
            const equipmentData = {
                inventory_number: formData.get('inventory_number'),
                name: formData.get('name'),
                type: formData.get('type'),
                brand: formData.get('brand') || null,
                model: formData.get('model') || null,
                specifications: formData.get('specifications') || null,
                status: formData.get('status'),
                state_id: stateIdValue && stateIdValue.trim() !== '' ? parseInt(stateIdValue) : null,
                assigned_to: assignedToValue && assignedToValue.trim() !== '' ? assignedToValue.trim() : null,
                location_details: formData.get('location_details') || null
            };

            // Debug: mostrar datos que se envían
            console.log('🔍 Datos que se envían al servidor:', equipmentData);

            // Mostrar loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>Guardando...';

            // Determinar si es creación o edición
            let response;
            
            if (equipmentId) {
                response = await API.put(`/equipment/${equipmentId}`, equipmentData);
            } else {
                response = await API.post('/equipment', equipmentData);
            }
            
            // El servidor devuelve directamente el objeto con message y equipment
            if (response.message) {
                UI.showNotification(response.message, 'success');
                this.closeDynamicModal();
                
                // Usar la nueva función para refrescar la lista
                setTimeout(() => {
                    this.refreshEquipmentList();
                }, 500);
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error guardando equipo:', error);
            UI.showNotification(ApiUtils.handleError(error), 'error');
        } finally {
            // Restaurar botón
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save" style="margin-right: 8px;"></i>Guardar Equipo';
            }
        }
    }

    // Cerrar modal dinámico
    closeDynamicModal() {
        if (this.dynamicModal) {
            document.body.removeChild(this.dynamicModal);
            this.dynamicModal = null;
            console.log('🚀 Modal dinámico cerrado');
        }
    }

    // Cerrar modal (mantener para compatibilidad)
    closeModal() {
        this.closeDynamicModal();
    }

    // Ver detalles del equipo
    async viewEquipment(equipmentId) {
        try {
            const response = await API.get(`/equipment/${equipmentId}`);
            if (response.equipment) {
                this.showEquipmentDetails(response.equipment);
            } else {
                throw new Error('No se encontró el equipo');
            }
        } catch (error) {
            console.error('Error cargando detalles del equipo:', error);
            UI.showNotification('Error cargando detalles del equipo', 'error');
        }
    }

    // Mostrar detalles del equipo
    showEquipmentDetails(equipment) {
        // Implementar modal de detalles
        console.log('Mostrar detalles:', equipment);
    }

    // Eliminar equipo
    async deleteEquipment(equipmentId) {
        console.log('🔍 deleteEquipment llamado con ID:', equipmentId);
        console.log('🔍 Equipment object:', window.Equipment);
        console.log('🔍 deleteEquipment method:', window.Equipment?.deleteEquipment);
        
        try {
            // Verificar que UI está disponible
            if (!UI || !UI.showConfirmDialog) {
                console.error('❌ UI o showConfirmDialog no está disponible');
                alert('Error: UI no está disponible');
                return;
            }
            
            console.log('✅ UI.showConfirmDialog disponible, mostrando diálogo...');
            
            // Mostrar diálogo de confirmación
            const confirmed = await UI.showConfirmDialog(
                '¿Estás seguro de que quieres eliminar este equipo?',
                'Esta acción no se puede deshacer. El equipo será eliminado permanentemente de la base de datos.'
            );
            
            console.log('🔍 Resultado del diálogo de confirmación:', confirmed);
            
            if (!confirmed) {
                console.log('❌ Usuario canceló la eliminación');
                return; // Usuario canceló la acción
            }
            
            console.log('✅ Usuario confirmó, procediendo con eliminación...');
            
            // Mostrar loading
            UI.showNotification('Eliminando equipo...', 'info');
            
            // Realizar petición de eliminación
            const response = await API.delete(`/equipment/${equipmentId}`);
            
            console.log('🔍 Respuesta del servidor:', response);
            
            if (response.message) {
                // Mostrar mensaje de éxito
                UI.showNotification(response.message, 'success');
                
                // Recargar la lista de equipos
                await this.loadEquipmentList();
                
                // Actualizar estadísticas si están disponibles
                if (typeof this.loadEquipmentStats === 'function') {
                    await this.loadEquipmentStats();
                }
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
            
        } catch (error) {
            console.error('❌ Error eliminando equipo:', error);
            
            // Mostrar mensaje de error específico
            let errorMessage = 'Error eliminando equipo';
            
            if (error.message) {
                if (error.message.includes('404')) {
                    errorMessage = 'El equipo no fue encontrado';
                } else if (error.message.includes('400')) {
                    errorMessage = 'No se puede eliminar este equipo porque tiene asignaciones activas';
                } else if (error.message.includes('500')) {
                    errorMessage = 'Error interno del servidor';
                }
            }
            
            UI.showNotification(errorMessage, 'error');
        }
    }

    // Importación desde Excel
    showImportModal() {
        const modal = document.getElementById('import-modal');
        modal.style.display = 'block';
        this.currentStep = 1;
        this.showImportStep(1);
    }

    // Manejar subida de archivo
    async handleFileUpload(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await API.post('/equipment/upload-excel', formData);
            
            if (response.success) {
                this.excelData = response.data;
                this.nextImportStep();
            } else {
                throw new Error(response.message || 'Error procesando archivo');
            }
        } catch (error) {
            console.error('Error procesando archivo:', error);
            UI.showNotification('Error procesando archivo Excel', 'error');
        }
    }

    // Generar mapeo de columnas
    generateColumnMapping() {
        const tbody = document.getElementById('mapping-tbody');
        tbody.innerHTML = '';

        const systemFields = [
            { key: 'inventory_number', label: 'Número de Inventario' },
            { key: 'name', label: 'Nombre del Equipo' },
            { key: 'type', label: 'Tipo' },
            { key: 'brand', label: 'Marca' },
            { key: 'model', label: 'Modelo' },
            { key: 'specifications', label: 'Especificaciones' },
            { key: 'status', label: 'Estado' },
            { key: 'state_id', label: 'Estado/Región' },
            { key: 'assigned_to', label: 'Responsable del Equipo' }
        ];

        systemFields.forEach(field => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <select class="column-mapping" data-field="${field.key}">
                        <option value="">Seleccionar columna</option>
                        ${this.excelData.columns.map(col => 
                            `<option value="${col}">${col}</option>`
                        ).join('')}
                    </select>
                </td>
                <td>${field.label}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Obtener mapeo de columnas
    getMapping() {
        const mapping = {};
        const selects = document.querySelectorAll('.column-mapping');
        selects.forEach(select => {
            const field = select.getAttribute('data-field');
            const value = select.value;
            if (value) {
                mapping[field] = value;
            }
        });
        return mapping;
    }

    // Validar datos de importación
    async validateImportData() {
        try {
            const mapping = this.getMapping();
            const validationData = {
                mapping: mapping,
                data: this.excelData.data
            };

            const response = await API.post('/equipment/validate-import', validationData);
            
            if (response.success) {
                this.validationResults = response.data;
                this.displayValidationResults();
                this.nextImportStep();
            } else {
                throw new Error(response.message || 'Error en validación');
            }
        } catch (error) {
            console.error('Error validando datos:', error);
            UI.showNotification('Error en validación de datos', 'error');
        }
    }

    // Mostrar resultados de validación
    displayValidationResults() {
        const validCount = document.getElementById('valid-count');
        const errorCount = document.getElementById('error-count');
        const errorsContainer = document.getElementById('validation-errors');

        if (validCount) validCount.textContent = this.validationResults.valid || 0;
        if (errorCount) errorCount.textContent = this.validationResults.errors?.length || 0;

        if (errorsContainer && this.validationResults.errors) {
            errorsContainer.innerHTML = this.validationResults.errors.map(error => 
                `<div class="error-item">${error}</div>`
            ).join('');
        }
    }

    // Confirmar importación
    async confirmImport() {
        try {
            const importData = {
                mapping: this.getMapping(),
                data: this.excelData.data,
                validation: this.validationResults
            };

            const response = await API.post('/equipment/import', importData);
            
            if (response.success) {
                UI.showNotification(
                    `Importación completada: ${response.data.imported} equipos`, 
                    'success'
                );
                this.closeImportModal();
                this.loadEquipmentList();
            } else {
                throw new Error(response.message || 'Error en importación');
            }
        } catch (error) {
            console.error('Error en importación:', error);
            UI.showNotification('Error en importación', 'error');
        }
    }

    // Descargar plantilla
    downloadTemplate() {
        const link = document.createElement('a');
        link.href = '/templates/equipment-template.xlsx';
        link.download = 'plantilla-equipos.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Exportar a Excel
    async exportToExcel() {
        try {
            console.log('🚀 Iniciando exportación a Excel...');
            console.log('📊 Filtros actuales:', this.filters);
            console.log('🔍 Estado de autenticación:', ConfigUtils.isAuthenticated());
            console.log('🔍 Token disponible:', !!ConfigUtils.getAuthToken());
            
            // Filtrar solo los parámetros válidos para la consulta
            const queryParams = {};
            if (this.filters.search) queryParams.search = this.filters.search;
            if (this.filters.type) queryParams.type = this.filters.type;
            if (this.filters.status) queryParams.status = this.filters.status;
            if (this.filters.state) {
                // Convertir string de estado a número
                const stateId = this.getStateId(this.filters.state);
                if (stateId) {
                    queryParams.state_id = stateId;
                }
            }
            
            console.log('🔍 Parámetros filtrados:', queryParams);
            console.log('🔍 Tipos de parámetros:', {
                search: typeof queryParams.search,
                type: typeof queryParams.type,
                status: typeof queryParams.status,
                state_id: typeof queryParams.state_id
            });
            
            const params = new URLSearchParams(queryParams);
            console.log('🔗 Parámetros de consulta:', params.toString());
            
            // Construir la URL solo si hay parámetros
            const exportUrl = params.toString() ? `/equipment/export?${params}` : '/equipment/export';
            console.log('🔗 URL completa:', exportUrl);
            
            console.log('📡 Realizando petición a la API...');
            const response = await API.get(exportUrl, { responseType: 'blob' });
            
            console.log('✅ Respuesta recibida:', response);
            console.log('📦 Tipo de respuesta:', typeof response);
            console.log('📏 Tamaño del blob:', response.size);
            console.log('🎯 Tipo MIME:', response.type);
            
            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `equipos-${new Date().toISOString().split('T')[0]}.xlsx`;
            
            console.log('📥 Descargando archivo:', link.download);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            UI.showNotification('Exportación completada', 'success');
            console.log('✅ Exportación completada exitosamente');
        } catch (error) {
            console.error('❌ Error exportando:', error);
            console.error('❌ Stack trace:', error.stack);
            UI.showNotification('Error en exportación', 'error');
        }
    }

    // Navegación de pasos de importación
    showImportStep(step) {
        // Ocultar todos los pasos
        document.querySelectorAll('.import-step').forEach(el => {
            el.classList.remove('active');
        });
        
        // Mostrar paso actual
        const currentStep = document.getElementById(`import-step-${step}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }

        // Actualizar botones
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const confirmBtn = document.getElementById('confirm-btn');

        if (prevBtn) prevBtn.style.display = step > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = step < 4 ? 'block' : 'none';
        if (confirmBtn) confirmBtn.style.display = step === 4 ? 'block' : 'none';
    }

    nextImportStep() {
        if (this.currentStep === 1) {
            this.generateColumnMapping();
        } else if (this.currentStep === 2) {
            this.validateImportData();
            return; // La validación maneja el siguiente paso
        }
        
        this.currentStep++;
        this.showImportStep(this.currentStep);
    }

    previousImportStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showImportStep(this.currentStep);
        }
    }

    closeImportModal() {
        const modal = document.getElementById('import-modal');
        modal.style.display = 'none';
        this.currentStep = 1;
        this.excelData = null;
        this.mapping = {};
        this.validationResults = null;
    }

    // Actualizar lista
    refreshList() {
        this.loadEquipmentList();
        this.loadEquipmentStats();
    }

    // Utilidades
    getTypeLabel(type) {
        const types = {
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
        };
        return types[type] || type;
    }

    getStatusLabel(status) {
        const statuses = {
            active: 'Activo',
            maintenance: 'Mantenimiento',
            out_of_service: 'Fuera de servicio',
            disposed: 'Desechado'
        };
        return statuses[status] || status;
    }

    getStatusIcon(status) {
        const icons = {
            active: 'fa-check-circle',
            maintenance: 'fa-tools',
            out_of_service: 'fa-times-circle',
            disposed: 'fa-trash'
        };
        return icons[status] || 'fa-question-circle';
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async refreshEquipmentList() {
        try {
            console.log('🔄 Refrescando lista de equipos...');
            await this.loadEquipmentList(false); // Pasar false para no mostrar notificaciones
            console.log('✅ Lista de equipos actualizada');
        } catch (error) {
            console.error('❌ Error refrescando lista:', error);
            // No mostrar notificación de error al usuario
            // Solo log para debugging
            // La creación del equipo fue exitosa, este error es solo para la recarga
        }
    }

    // Cargar estados para el modal
    async loadStatesForModal() {
        try {
            const response = await API.get('/states');
            if (response.data) {
                const stateSelect = this.dynamicModal.querySelector('select[name="state_id"]');
                if (stateSelect) {
                    // Mantener la opción por defecto
                    const defaultOption = stateSelect.querySelector('option[value=""]');
                    stateSelect.innerHTML = '';
                    if (defaultOption) {
                        stateSelect.appendChild(defaultOption);
                    }
                    
                    // Agregar las opciones de estados
                    response.data.forEach(state => {
                        const option = document.createElement('option');
                        option.value = state.id;
                        option.textContent = state.name;
                        stateSelect.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Error cargando estados:', error);
            // Fallback a estados estáticos si falla la carga
            const stateSelect = this.dynamicModal.querySelector('select[name="state_id"]');
            if (stateSelect) {
                stateSelect.innerHTML = `
                    <option value="">Seleccionar estado</option>
                    <option value="1">Estado 1</option>
                    <option value="2">Estado 2</option>
                    <option value="3">Estado 3</option>
                    <option value="4">Estado 4</option>
                    <option value="5">Estado 5</option>
                `;
            }
        }
    }
}

// Función global de respaldo para eliminar equipo
window.deleteEquipmentGlobal = function(equipmentId) {
    console.log('🔍 deleteEquipmentGlobal llamado con ID:', equipmentId);
    if (window.Equipment && window.Equipment.deleteEquipment) {
        return window.Equipment.deleteEquipment(equipmentId);
    } else {
        console.error('❌ Equipment no está disponible');
        alert('Error: Equipment no está disponible. Recargando página...');
        location.reload();
    }
};

// Inicializar módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.Equipment = new Equipment();
    
    // Hacer métodos disponibles globalmente para compatibilidad
    const methodsToBind = [
        'showCreateForm',
        'viewEquipment', 
        'deleteEquipment',
        'goToPage',
        'clearFilters',
        'showImportModal',
        'exportToExcel',
        'downloadTemplate',
        'refreshList'
    ];
    
    methodsToBind.forEach(method => {
        if (window.Equipment[method]) {
            window.Equipment[method] = window.Equipment[method].bind(window.Equipment);
        }
    });
    
    console.log('✅ Equipment inicializado y métodos disponibles globalmente');
    console.log('🔍 Métodos disponibles:', methodsToBind);
});

 
