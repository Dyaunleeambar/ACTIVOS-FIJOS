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

        // Columnas disponibles para exportación (clave alineada con backend)
        this.availableExportColumns = [
            { key: 'inventory_number', label: 'Número de Inventario' },
            { key: 'name', label: 'Nombre del Equipo' },
            { key: 'type', label: 'Tipo' },
            { key: 'brand', label: 'Marca' },
            { key: 'model', label: 'Modelo' },
            { key: 'specifications', label: 'Especificaciones' },
            { key: 'status', label: 'Estado' },
            { key: 'state_name', label: 'Estado/Región' },
            { key: 'assigned_to', label: 'Asignado a' },
            { key: 'location_details', label: 'Detalles de Ubicación' },
            { key: 'created_at', label: 'Fecha de Creación' }
        ];

        // Mapeo de estados para conversión
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
        if (window.equipmentInitialized) {
            console.warn('⚠️ Equipment ya fue inicializado, se previene doble inicialización.');
            return;
        }

        // Verificar si el usuario está autenticado antes de inicializar
        if (!window.Auth || !window.Auth.isAuthenticated) {
            console.log('⛔ Usuario no autenticado, Equipment no se inicializa automáticamente');
            return;
        }

        window.equipmentInitialized = true;
        console.log('🔧 Inicializando Equipment...');

        // Limpiar estado antes de inicializar
        this.cleanState();

        // Configurar event listeners
        this.setupEventListeners();

        // Cargar datos solo si el usuario está autenticado
        this.loadFilterData();
        // Usar debounce para la carga inicial de equipos
        if (!this._debouncedLoadEquipmentList) {
            this._debouncedLoadEquipmentList = this.debounce(() => this.loadEquipmentList(), 1000);
        }
        this._debouncedLoadEquipmentList();

        console.log('✅ Equipment inicializado correctamente');
    }

    // Nueva función para limpiar estado
    cleanState() {
        console.log('🧹 Limpiando estado de Equipment...');

        // Resetear filtros
        this.filters = {
            search: '',
            type: '',
            status: '',
            state: ''
        };

        // Resetear paginación
        this.currentPage = 1;

        // Limpiar inputs del DOM si existen
        const searchInput = document.getElementById('search-equipment');
        if (searchInput) {
            searchInput.value = '';
        }

        const typeStatusFilter = document.getElementById('filter-type-status');
        if (typeStatusFilter) {
            typeStatusFilter.value = '';
        }

        const stateFilter = document.getElementById('filter-state');
        if (stateFilter) {
            stateFilter.value = '';
        }

        // Limpiar chips de filtros activos
        const activeFiltersContainer = document.getElementById('active-filters');
        if (activeFiltersContainer) {
            activeFiltersContainer.innerHTML = '';
        }

        console.log('✅ Estado limpiado');
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
        console.log('🔧 Configurando filtros compactos...');
        // Búsqueda (ahora en la sección de filtros)
        const searchInput = document.getElementById('search-equipment');
        if (searchInput) {
            console.log('✅ Campo de búsqueda encontrado, configurando event listener...');
            // Crear debounce manual para búsqueda
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                console.log('🔍 [DEBUG] Evento input en búsqueda:', e.target.value);
                // Limpiar timeout anterior
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                // Configurar nuevo timeout
                searchTimeout = setTimeout(() => {
                    console.log('⏰ [DEBUG] Ejecutando búsqueda con debounce. Valor:', e.target.value);
                    this.filters.search = e.target.value;
                    this.currentPage = 1;
                    console.log('🔍 [DEBUG] Filtros actuales antes de buscar:', JSON.stringify(this.filters));
                    this.loadEquipmentList();
                    this.updateActiveFilters();
                }, 300);
            });
        } else {
            console.error('❌ [DEBUG] Campo de búsqueda no encontrado');
        }

        // Filtro combinado Tipo + Estado
        const filterTypeStatus = document.getElementById('filter-type-status');
        if (filterTypeStatus) {
            console.log('✅ Filtro tipo/estado encontrado, configurando event listener...');
            filterTypeStatus.addEventListener('change', (e) => {
                console.log('🔍 [DEBUG] Evento change en filtro tipo/estado:', e.target.value);
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
                console.log('🔍 [DEBUG] Filtros actuales antes de buscar:', JSON.stringify(this.filters));
                this.loadEquipmentList();
                this.updateActiveFilters();
            });
        } else {
            console.error('❌ [DEBUG] Filtro tipo/estado no encontrado');
        }

        // Filtro de Estado/Región
        const filterState = document.getElementById('filter-state');
        if (filterState) {
            console.log('✅ Filtro estado encontrado, configurando event listener...');
            filterState.addEventListener('change', (e) => {
                console.log('🔍 [DEBUG] Evento change en filtro estado:', e.target.value);
                this.filters.state = e.target.value;
                this.currentPage = 1;
                console.log('🔍 [DEBUG] Filtros actuales antes de buscar:', JSON.stringify(this.filters));
                this.loadEquipmentList();
                this.updateActiveFilters();
            });
        } else {
            console.error('❌ [DEBUG] Filtro estado no encontrado');
        }
        console.log('✅ Configuración de filtros completada');
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

        // Renderizar chips visualmente y asignar event listeners
        activeFilters.forEach(filter => {
            const chip = document.createElement('div');
            chip.className = 'filter-chip';
            chip.innerHTML = `
                <span>${filter.label}</span>
                <button class="remove-chip" type="button" title="Remover filtro">
                    <i class="fas fa-times"></i>
                </button>
            `;
            // Asignar event listener CSP-compliant
            chip.querySelector('.remove-chip').addEventListener('click', () => {
                this.removeFilter(filter.type);
            });
            activeFiltersContainer.appendChild(chip);
        });
    }



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

    // Hacer removeFilter disponible globalmente
    static removeFilter(filterType) {
        if (window.Equipment && window.Equipment.removeFilter) {
            window.Equipment.removeFilter(filterType);
        } else {
            console.error('❌ Equipment.removeFilter no disponible');
        }
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
            console.log('🔍 [DEBUG] Filtros antes de preparar params:', JSON.stringify(filterParams));
            if (filterParams.state) {
                const stateId = this.getStateId(filterParams.state);
                if (stateId) {
                    filterParams.state_id = stateId;
                    delete filterParams.state; // Eliminar el string y usar el número
                }
            }
            console.log('🔍 [DEBUG] Params para API:', {
                page: this.currentPage,
                limit: this.itemsPerPage,
                ...filterParams
            });

            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.itemsPerPage,
                ...filterParams
            });

            console.log('🔍 [DEBUG] URL final para API:', `/equipment?${params}`);

            const response = await API.get(`/equipment?${params}`);
            console.log('✅ [DEBUG] Respuesta del servidor:', response);

            if (response.equipment) {
                console.log('✅ Equipos encontrados:', response.equipment.length);
                // Guardar la página actual en memoria para cálculos robustos (exportación página actual)
                this.equipment = Array.isArray(response.equipment) ? response.equipment : [];
                this.renderEquipmentTable(response.equipment);
                this.renderPagination(response.pagination);
                this.updateEquipmentCount(response.pagination.total);
                this.updateActiveFilters(); // Actualizar chips de filtros activos
            } else {
                console.warn('⚠️ Respuesta sin datos de equipos:', response);
                // Si no hay equipos, mostrar tabla vacía
                this.renderEquipmentTable([]);
                this.renderPagination({ currentPage: 1, totalPages: 0, total: 0, limit: 20, hasNextPage: false, hasPrevPage: false });
                this.updateEquipmentCount(0);
                this.updateActiveFilters(); // Actualizar chips de filtros activos
            }
        } catch (error) {
            console.error('❌ Error cargando equipos:', error);

            // Siempre usar la nueva función auxiliar para manejar errores
            this.handleEquipmentError(error, 'carga de equipos');

            this.renderEquipmentTable([]);
        }
    }

    // Sobrescribir loadEquipmentList para usar debounce en llamadas externas
    loadEquipmentListDebounced() {
        if (!this._debouncedLoadEquipmentList) {
            this._debouncedLoadEquipmentList = this.debounce(() => this.loadEquipmentList(), 1000);
        }
        this._debouncedLoadEquipmentList();
    }

    // Renderizar tabla de equipos
    renderEquipmentTable(equipment) {
        // Restaurar filas ocultas desde localStorage
        let hiddenRows = [];
        try {
            hiddenRows = JSON.parse(localStorage.getItem('hiddenEquipmentRows') || '[]');
        } catch (e) {
            hiddenRows = [];
        }
        const tbody = document.getElementById('equipment-tbody');

        if (!equipment || equipment.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">
                        <div style="padding: 40px;">
                            <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                            <p>No se encontraron equipos</p>
                            <button class="btn btn-secondary" id="add-first-equipment-btn">
                                <i class="fas fa-plus"></i> Agregar primer equipo
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Agregar encabezado de handle y de índice si no existen
        const thead = tbody.parentElement.querySelector('thead tr');
        if (thead) {
            if (!thead.querySelector('.drag-handle-col')) {
                const thHandle = document.createElement('th');
                thHandle.innerHTML = '<i class="fas fa-grip-vertical" title="Reordenar"></i>';
                thHandle.className = 'drag-handle-col';
                thead.insertBefore(thHandle, thead.firstChild);
            }
            if (!thead.querySelector('.index-col')) {
                const thIndex = document.createElement('th');
                thIndex.textContent = 'N°';
                thIndex.className = 'index-col';
                thead.insertBefore(thIndex, thead.children[1] || null);
            }
        }

        // Renderizado correcto de filas respetando el estado de oculto
        tbody.innerHTML = equipment.map((item, i) => {
            const index = (this.currentPage - 1) * this.itemsPerPage + i + 1;
            const isHidden = hiddenRows.includes(item.id);
            const isSim = item.type === 'sim_chip';
            const isRadio = item.type === 'radio_communication';
            const typeBadge = isSim ? '<span class="badge badge-sim" title="SIM">SIM</span>' : (isRadio ? '<span class="badge badge-radio" title="Radio">RAD</span>' : '');
            return `
            <tr id="equipment-row-${item.id}" draggable="true" class="draggable-row" style="display: ${isHidden ? 'none' : ''}">
                <td class="drag-handle-col" style="cursor: grab; text-align: center; width: 32px;">
                    <i class="fas fa-grip-vertical" title="Arrastrar para reordenar"></i>
                </td>
                <td class="index-col">${index}</td>
                <td>
                    <strong>${item.inventory_number}</strong> ${typeBadge}
                </td>
                <td>
                    <div>
                        <div style="font-weight: 500;">${item.name}</div>
                        <small style="color: #666;">${item.brand || ''} ${item.model || ''}</small>
                        ${(item.sims_count > 0 || item.radios_count > 0) ? `<div class="inline-badges" style="margin-top:4px;">${item.sims_count > 0 ? `<span class="badge badge-sim">${item.sims_count} SIM</span>` : ''} ${item.radios_count > 0 ? `<span class="badge badge-radio">${item.radios_count} RAD</span>` : ''}</div>` : ''}
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
                        <div title="${(item.location_details || '').replace(/\"/g,'&quot;')}">${item.state_name || 'N/A'}</div>
                    </div>
                </td>
                <td>
                    ${item.assigned_to || '<span style="color: #999;">Sin asignar</span>'}
                </td>
                <td>
                    <div class="table-actions-cell">
                        <button class="action-btn view" data-action="toggle-row" data-id="${item.id}" title="${isHidden ? 'Mostrar fila' : 'Ocultar fila'}">
                            <i class="fas ${isHidden ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                        <button class="action-btn edit" data-action="edit" data-id="${item.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-action="delete" data-id="${item.id}" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');

        // Asignar event listeners a los botones de acción
        tbody.querySelectorAll('.action-btn').forEach(btn => {
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');
            if (action === 'edit') {
                btn.addEventListener('click', (e) => {
                    window.safeEquipmentCall && window.safeEquipmentCall('showCreateForm', Number(id));
                });
            } else if (action === 'delete') {
                btn.addEventListener('click', (e) => {
                    window.deleteEquipmentGlobal && window.deleteEquipmentGlobal(Number(id));
                });
            }
        });
        // Asignar event listener al botón "Agregar primer equipo"
        const addBtn = document.getElementById('add-first-equipment-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                window.editEquipmentGlobal && window.editEquipmentGlobal();
            });
        }

        // --- Drag & Drop con SortableJS ---
        console.log('Preparando SortableJS', {Sortable: window.Sortable, tbody});
        if (window.Sortable && tbody) {
            // Destruir instancia previa si existe
            if (tbody._sortableInstance) {
                tbody._sortableInstance.destroy();
                tbody._sortableInstance = null;
            }
            const self = this;
            tbody._sortableInstance = Sortable.create(tbody, {
                // handle: '.drag-handle-col', // Descomenta para restringir solo al handle
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: async function (evt) {
                    console.log('Drag terminado', evt);

                    // Obtener nuevo orden de IDs
                    const newOrder = Array.from(tbody.children).map(row => {
                        const idMatch = row.id && row.id.match(/^equipment-row-(\d+)$/);
                        return idMatch ? parseInt(idMatch[1], 10) : null;
                    }).filter(Boolean);
                    // Reordenar this.equipment según newOrder SOLO para la página actual
                    const startIdx = (self.currentPage - 1) * self.itemsPerPage;
                    const endIdx = startIdx + self.itemsPerPage;
                    const currentPageEquip = self.equipment.slice(startIdx, endIdx);
                    const reordered = [];
                    newOrder.forEach(id => {
                        const found = currentPageEquip.find(eq => eq.id === id);
                        if (found) reordered.push(found);
                    });
                    // Opcional: feedback visual
                    tbody.classList.add('sortable-updated');
                    setTimeout(() => tbody.classList.remove('sortable-updated'), 300);

                    // Persistir nuevo orden en el backend
                    try {
                        await API.post('/equipment/reorder', { order: newOrder });
                        // Opcional: mostrar mensaje de éxito
                        console.log('✅ Orden guardado en backend');
                    } catch (err) {
                        // Opcional: revertir el orden en UI si falla
                        alert('No se pudo guardar el nuevo orden en el servidor.');
                        console.error('❌ Error al guardar orden:', err);
                    }
                }
            });
        }
        // --- Fin Drag & Drop ---
    }

    // Mostrar todas las filas ocultas y limpiar localStorage
    showAllRows() {
        // Limpiar cualquier persistencia de filas ocultas
        localStorage.removeItem('hiddenEquipmentRows');
        // Forzar recarga completa de la tabla desde la fuente de datos
        if (typeof this.loadEquipmentList === 'function') {
            this.loadEquipmentList();
        }
    }

    // Alias para compatibilidad con el handler global
    refreshList() {
        this.showAllRows();
    }


    // Alternar visibilidad de la fila de la tabla con persistencia en localStorage
    toggleRowVisibility(equipmentId, btn) {
        const row = document.getElementById(`equipment-row-${equipmentId}`);
        if (!row) return;
        const icon = btn && btn.querySelector('i');
        // Leer estado actual de filas ocultas
        let hiddenRows = JSON.parse(localStorage.getItem('hiddenEquipmentRows') || '[]');
        
        if (row.style.display !== 'none') {
            row.style.display = 'none';
            if (!hiddenRows.includes(equipmentId)) hiddenRows.push(equipmentId);
            if (icon) {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
            btn.setAttribute('title', 'Mostrar fila');
        } else {
            row.style.display = '';
            hiddenRows = hiddenRows.filter(id => id !== equipmentId);
            if (icon) {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
            btn.setAttribute('title', 'Ocultar fila');
        }
        localStorage.setItem('hiddenEquipmentRows', JSON.stringify(hiddenRows));
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
    async showModalDynamically(equipmentId) {
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
            <form id="dynamic-equipment-form" style="padding: 0; display: block;">
                <!-- Tabs Header -->
                <div style="display:flex; border-bottom:1px solid #e1e5e9; background:#fff;">
                    <button type="button" class="tab-btn active" data-tab="it" style="flex:1; padding:14px 16px; border:none; background:#fff; cursor:pointer; font-weight:600;">Informática</button>
                    <button type="button" class="tab-btn" data-tab="comms" style="flex:1; padding:14px 16px; border:none; background:#fff; cursor:pointer; font-weight:600;">Comunicaciones</button>
                </div>

                <!-- TAB: Informática -->
                <div id="tab-it" class="tab-panel active" style="padding: 32px; display: grid; gap: 24px;">
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
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Marca *</label>
                            <input type="text" name="brand" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Modelo *</label>
                            <input type="text" name="model" required style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease;">
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
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Detalles de Ubicación</label>
                        <textarea name="location_details" rows="2" placeholder="Especificaciones adicionales de ubicación (opcional)" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px; transition: border-color 0.3s ease; resize: vertical;"></textarea>
                    </div>
                </div>

                <!-- Checkbox proponerBaja -->
                <div style="display: flex; align-items: center; gap: 8px; margin: 0 0 0 4px;">
                    <input type="checkbox" id="proponerBaja" name="proponerBaja" style="width: 18px; height: 18px; accent-color: #3b82f6; margin-right: 8px;">
                    <label for="proponerBaja" style="font-size: 15px; color: #333; cursor: pointer; user-select: none;">Proponer este equipo como baja (opcional)</label>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end; padding: 24px; border-top: 1px solid #e1e5e9; background: #f8fafc; border-radius: 0 0 12px 12px; margin-top: 24px;">
                    <button type="button" id="dynamic-cancel-btn" style="padding: 12px 24px; border: 2px solid #e1e5e9; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">Cancelar</button>
                    <button type="submit" data-tab-submit="it" style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease;">
                        <i class="fas fa-save" style="margin-right: 8px;"></i>Guardar Equipo
                    </button>
                </div>
                </div>

                <!-- TAB: Comunicaciones -->
                <div id="tab-comms" class="tab-panel" style="display:none; padding: 32px; display: grid; gap: 24px;">
                    <!-- Contenedor SIMs -->
                    <div style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; background: #f8fafc;">
                        <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 8px;">
                            <span style="width: 4px; height: 16px; background: #3b82f6; border-radius: 2px;"></span>
                            Líneas SIMs
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Número de la línea SIMs</label>
                                <input type="text" name="sims_number" placeholder="Ej: 0414-1234567" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px;">
                                <small style="color:#666;">Si se ingresa, se usará como inventario con prefijo SIM-</small>
                            </div>
                            <div>
                            <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Responsable</label>
                            <input type="text" name="sims_responsable" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px;">
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Número de la línea Roaming</label>
                                <input type="text" name="sims_roaming" placeholder="Opcional" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px;">
                            </div>
                            <div>
                            <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Estado</label>
                            <select name="sims_status" style="width:100%; padding:12px; border:2px solid #e1e5e9; border-radius:6px;">
                                    <option value="active">Activo</option>
                                    <option value="out_of_service">Fuera de servicio</option>
                                </select>
                            </div>
                        </div>
                        <div style="margin-top: 16px;">
                            <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Detalles de Ubicación</label>
                            <textarea name="sims_location" rows="2" style="width:100%; padding:12px; border:2px solid #e1e5e9; border-radius:6px;"></textarea>
                        </div>
                    </div>

                    <!-- Contenedor Radios -->
                    <div style="border: 1px solid #e1e5e9; border-radius: 8px; padding: 24px; background: #f8fafc;">
                        <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #333; display: flex; align-items: center; gap: 8px;">
                            <span style="width: 4px; height: 16px; background: #3b82f6; border-radius: 2px;"></span>
                            Radios
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Número de inventario</label>
                                <input type="text" name="radio_inventory" placeholder="Ej: RAD-0001; RAD-0002" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px;">
                                <small style="color:#666;">Se recomienda prefijo RAD-</small>
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Responsable</label>
                                <input type="text" name="radio_responsable" style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px; font-size: 14px;">
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Estado/Región</label>
                                <select name="radio_state_id" style="width:100%; padding:12px; border:2px solid #e1e5e9; border-radius:6px;">
                                    <option value="">Seleccionar estado</option>
                                </select>
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:8px; font-weight:500; color:#333;">Estado</label>
                                <select name="radio_status" style="width:100%; padding:12px; border:2px solid #e1e5e9; border-radius:6px;">
                                    <option value="active">Activo</option>
                                    <option value="out_of_service">Fuera de servicio</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px; margin-top:12px;">
                            <input type="checkbox" id="radio_proponerBaja" name="radio_proponerBaja" style="width:18px; height:18px; accent-color:#3b82f6;">
                            <label for="radio_proponerBaja" style="font-size:15px; color:#333;">Proponer este radio como baja (opcional)</label>
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end; padding: 24px; border-top: 1px solid #e1e5e9; background: #f8fafc; border-radius: 0 0 12px 12px;">
                        <button type="button" id="dynamic-cancel-btn-comm" style="padding:12px 24px; border:2px solid #e1e5e9; background:#fff; border-radius:6px; cursor:pointer; font-size:14px; font-weight:500;">Cancelar</button>
                        <button type="button" id="dynamic-save-comm" data-tab-submit="comms" style="padding:12px 24px; background:#3b82f6; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:500;">
                            <i class="fas fa-save" style="margin-right:8px;"></i>Guardar Comunicaciones
                        </button>
                    </div>
                </div>
            </form>
        `;

        // Agregar event listeners mejorados
        const closeBtn = modalContent.querySelector('#dynamic-close-btn');
        const cancelBtn = modalContent.querySelector('#dynamic-cancel-btn');
        const commCancelBtn = modalContent.querySelector('#dynamic-cancel-btn-comm');
        const saveCommBtn = modalContent.querySelector('#dynamic-save-comm');
        const form = modalContent.querySelector('#dynamic-equipment-form');
        const tabButtons = modalContent.querySelectorAll('.tab-btn');
        const tabIt = modalContent.querySelector('#tab-it');
        const tabComms = modalContent.querySelector('#tab-comms');

        closeBtn.onclick = () => this.closeDynamicModal();
        cancelBtn.onclick = () => this.closeDynamicModal();
        commCancelBtn.onclick = () => this.closeDynamicModal();

        // Tabs switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const target = btn.getAttribute('data-tab');
                if (target === 'it') {
                    tabIt.style.display = 'grid';
                    tabComms.style.display = 'none';
                } else {
                    tabIt.style.display = 'none';
                    tabComms.style.display = 'grid';
                }
            });
        });

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
            // Inyectar el valor del checkbox en el formulario antes de guardar
            const proponerBajaCheckbox = form.querySelector('#proponerBaja');
            if (proponerBajaCheckbox) {
                // Crear o actualizar un input hidden para enviar el valor correctamente
                let hiddenInput = form.querySelector('input[name="proponerBaja_hidden"]');
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'proponerBaja_hidden';
                    form.appendChild(hiddenInput);
                }
                hiddenInput.value = proponerBajaCheckbox.checked ? 'true' : '';
            }
            this.saveDynamicEquipment(form, equipmentId);
        };

        // Guardar Comunicaciones
        if (saveCommBtn) {
            saveCommBtn.addEventListener('click', async () => {
                try {
                    // Validar SIMs y/o Radios por separado
                    await this.saveCommunications(form);
                } catch (err) {
                    console.error('Error guardando comunicaciones:', err);
                    UI.showNotification('Error guardando comunicaciones', 'error');
                }
            });
        }

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
        // Cargar estados para select de radios en comunicaciones
        try {
            const response = await API.get('/states');
            const radiosStateSelect = modalContent.querySelector('select[name="radio_state_id"]');
            if (response && response.data && radiosStateSelect) {
                // Mantener primera opción
                const keep = radiosStateSelect.querySelector('option[value=""]');
                radiosStateSelect.innerHTML = '';
                if (keep) radiosStateSelect.appendChild(keep);
                response.data.forEach(state => {
                    const opt = document.createElement('option');
                    opt.value = state.id;
                    opt.textContent = state.name;
                    radiosStateSelect.appendChild(opt);
                });
            }
        } catch (e) {
            console.warn('No se pudieron cargar estados para radios');
        }

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
                // Rellenar el checkbox proponerBaja si existe
                if (typeof equipment.proponerBaja !== 'undefined') {
                    const bajaCheckbox = form.querySelector('#proponerBaja');
                    if (bajaCheckbox) {
                        bajaCheckbox.checked = Boolean(equipment.proponerBaja);
                    }
                }
                // Opcional: si el equipo es SIM o Radio, precargar en pestaña comunicaciones
                if (equipment.type === 'sim_chip') {
                    const sn = form.querySelector('input[name="sims_number"]');
                    const sr = form.querySelector('input[name="sims_responsable"]');
                    const srm = form.querySelector('input[name="sims_roaming"]');
                    const ss = form.querySelector('select[name="sims_status"]');
                    const sl = form.querySelector('textarea[name="sims_location"]');
                    if (sn) sn.value = String(equipment.inventory_number || '').replace(/^SIM-/, '');
                    if (sr) sr.value = equipment.assigned_to || '';
                    if (srm) srm.value = '';
                    if (ss) ss.value = equipment.status || 'active';
                    if (sl) sl.value = equipment.location_details || '';
                }
                if (equipment.type === 'radio_communication') {
                    const ri = form.querySelector('input[name="radio_inventory"]');
                    const rr = form.querySelector('input[name="radio_responsable"]');
                    const rl = form.querySelector('input[name="radio_location"]');
                    const rs = form.querySelector('select[name="radio_status"]');
                    const rb = form.querySelector('#radio_proponerBaja');
                    if (ri) ri.value = equipment.inventory_number || '';
                    if (rr) rr.value = equipment.assigned_to || '';
                    if (rl) rl.value = equipment.location_details || '';
                    if (rs) rs.value = equipment.status || 'active';
                    if (rb) rb.checked = Boolean(equipment.proponerBaja);
                }
            }
        } catch (error) {
            console.error('Error cargando datos del equipo:', error);

            // Usar la nueva función auxiliar para manejar errores
            this.handleEquipmentError(error, 'carga de datos del equipo');
        }
    }

    // Guardar equipo desde el modal dinámico mejorado
    async saveDynamicEquipment(form, equipmentId = null) {
        try {
            const formData = new FormData(form);

            // Validación básica
            const requiredFields = ['inventory_number', 'name', 'type', 'status', 'assigned_to'];
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
                // Para comunicaciones permitimos no enviar state_id; aquí lo conservamos si fue provisto
                state_id: stateIdValue && stateIdValue.trim() !== '' ? parseInt(stateIdValue) : null,
                assigned_to: assignedToValue && assignedToValue.trim() !== '' ? assignedToValue.trim() : null,
                location_details: formData.get('location_details') || null
            };
            // Añadir proponerBaja si está presente
            const proponerBajaHidden = formData.get('proponerBaja_hidden');
            if (typeof proponerBajaHidden !== 'undefined') {
                equipmentData.proponerBaja = proponerBajaHidden === 'true';
            }

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

            // Usar la nueva función auxiliar para manejar errores
            const errorHandled = this.handleEquipmentError(error, 'guardado de equipo');

            // Si es un error de autenticación, cerrar el modal
            if (!errorHandled) {
                this.closeDynamicModal();
                return;
            }
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

    // Guardar Comunicaciones (SIMs y/o Radios) de forma independiente
    async saveCommunications(form) {
        const simsNumber = form.querySelector('input[name="sims_number"]').value.trim();
        const simsResponsable = form.querySelector('input[name="sims_responsable"]').value.trim();
        const simsRoaming = form.querySelector('input[name="sims_roaming"]').value.trim();
        const simsStatus = form.querySelector('select[name="sims_status"]').value;
        const simsLocation = form.querySelector('textarea[name="sims_location"]').value.trim();

        const radioInventory = form.querySelector('input[name="radio_inventory"]').value.trim();
        const radioResponsable = form.querySelector('input[name="radio_responsable"]').value.trim();
        const radioLocation = form.querySelector('input[name="radio_location"]').value.trim();
        const radioStatus = form.querySelector('select[name="radio_status"]').value;
        const radioStateId = form.querySelector('select[name="radio_state_id"]').value;
        const radioBaja = form.querySelector('#radio_proponerBaja').checked;

        let anySaved = false;

        // Guardar SIM si se especificó alguno de sus campos clave
        if (simsNumber || simsRoaming || simsResponsable || simsLocation) {
            // Regla: si no hay número de SIM, no crear ni actualizar
            if (!simsNumber) {
                UI.showNotification('No se creó/actualizó la SIM: ingrese Número de la línea SIMs.', 'warning');
            } else {
                const inv = simsNumber.startsWith('SIM-') ? simsNumber : `SIM-${simsNumber}`;
                const simPayload = {
                    inventory_number: inv,
                    name: `Línea SIM ${inv}`,
                    type: 'sim_chip',
                    specifications: simsRoaming ? `roaming:${simsRoaming}` : undefined,
                    status: simsStatus || 'active',
                    assigned_to: simsResponsable || undefined,
                    location_details: simsLocation || undefined
                };
                await this.upsertEquipmentByInventory(inv, simPayload);
                anySaved = true;
            }
        }

        // Guardar Radio si se especificó número de inventario (obligatorio para radios)
        if (radioInventory) {
            // Soportar múltiples inventarios separados por ';'
            const tokens = radioInventory.split(';').map(t => t.trim()).filter(t => t.length > 0);
            for (const token of tokens) {
                const invR = token.startsWith('RAD-') ? token : `RAD-${token}`;
                const radioPayload = {
                    inventory_number: invR,
                    name: `Radio ${invR}`,
                    type: 'radio_communication',
                    status: radioStatus || 'active',
                    assigned_to: radioResponsable || undefined,
                    state_id: radioStateId ? parseInt(radioStateId) : undefined,
                    location_details: radioLocation || undefined,
                    proponerBaja: !!radioBaja
                };

                await this.upsertEquipmentByInventory(invR, radioPayload);
                anySaved = true;
            }
        }

        if (!anySaved) {
            UI.showNotification('No hay datos para guardar en Comunicaciones', 'warning');
            return;
        }

        UI.showNotification('Comunicaciones guardadas', 'success');
        this.closeDynamicModal();
        setTimeout(() => this.refreshEquipmentList(), 500);
    }

    // Upsert por inventory_number
    async upsertEquipmentByInventory(inventoryNumber, payload) {
        try {
            // Intentar obtener el equipo por inventory_number usando endpoint dedicado
            let found = null;
            try {
                const byInv = await API.get(`/equipment/by-inventory/${encodeURIComponent(inventoryNumber)}`);
                found = byInv && byInv.equipment ? byInv.equipment : null;
            } catch (_) {
                found = null;
            }
            if (found) {
                await API.put(`/equipment/${found.id}`, payload);
            } else {
                await API.post('/equipment', payload);
            }
        } catch (error) {
            console.error('Error en upsertEquipmentByInventory:', error);
            throw error;
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
        // Convertir ID a número entero
        const id = parseInt(equipmentId, 10);

        console.log('🔍 deleteEquipment llamado con ID:', equipmentId);
        console.log('🔍 ID convertido a número:', id);
        console.log('🔍 Equipment object:', window.Equipment);
        console.log('🔍 deleteEquipment method:', window.Equipment?.deleteEquipment);

        // Validar que el ID sea un número válido
        if (isNaN(id) || id <= 0) {
            console.error('❌ ID inválido:', equipmentId);
            UI.showNotification('ID de equipo inválido', 'error');
            return;
        }

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

            // Realizar petición de eliminación con ID convertido
            const response = await API.delete(`/equipment/${id}`);

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
                    // Intentar extraer el mensaje específico del servidor
                    if (error.response && error.response.data && error.response.data.error) {
                        errorMessage = error.response.data.error;
                    } else {
                        errorMessage = 'No se puede eliminar este equipo porque tiene asignaciones activas';
                    }
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
        modal.style.display = 'flex';
        this.currentStep = 1;
        this.showImportStep(1);

        // Agregar event listeners para cerrar el modal
        this.setupImportModalListeners();

        // Disparar evento para que los handlers se inicialicen
        document.dispatchEvent(new Event('importModalShown'));
    }

    // Configurar event listeners del modal de importación
    setupImportModalListeners() {
        const modal = document.getElementById('import-modal');
        if (!modal) return;

        // Remover event listeners existentes para evitar duplicados
        const newModal = modal.cloneNode(true);
        modal.parentNode.replaceChild(newModal, modal);

        // Obtener referencias actualizadas
        const updatedModal = document.getElementById('import-modal');
        const closeBtn = updatedModal.querySelector('.modal-close');

        // Cerrar con el botón X
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeImportModal();
            });
        }

        // Cerrar haciendo clic en el overlay
        updatedModal.addEventListener('click', (e) => {
            if (e.target === updatedModal) {
                this.closeImportModal();
            }
        });

        // Cerrar con ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeImportModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Event listener para subida de archivo
        const fileInput = document.getElementById('excel-file');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileUpload(file);
                }
            });
        }

        console.log('✅ Event listeners del modal de importación configurados');
    }

    // Manejar subida de archivo
    async handleFileUpload(file) {
        try {
            console.log('🚀 INICIANDO PROCESO DE IMPORTACIÓN');
            console.log('📁 Subiendo archivo:', file.name, 'Tamaño:', file.size);
            console.log('🔍 Tipo de archivo:', file.type);
            console.log('🔍 Estado de autenticación:', ConfigUtils.isAuthenticated());
            console.log('🔍 Token disponible:', !!ConfigUtils.getAuthToken());

            const formData = new FormData();
            formData.append('file', file);

            console.log('📦 FormData creado:', formData);
            console.log('📦 FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value);
            }

            console.log('🌐 Headers de autenticación:', ConfigUtils.getAuthHeaders());

            const response = await API.post('/equipment/upload-excel', formData);

            console.log('📊 Respuesta del servidor:', response);

            if (response.success) {
                this.excelData = response.data;
                console.log('✅ Datos Excel procesados:', this.excelData);
                console.log('🔄 Avanzando al siguiente paso...');
                this.nextImportStep();
                console.log('✅ PASO 1 COMPLETADO - Archivo procesado');
            } else {
                const errorMessage = response.error || response.message || 'Error procesando archivo';
                console.error('❌ Error en respuesta:', errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('❌ Error procesando archivo:', error);

            // Mostrar mensaje de error más específico
            let errorMessage = 'Error procesando archivo Excel';

            if (error.message.includes('400')) {
                errorMessage = 'El archivo no es válido. Verifique que sea un archivo Excel (.xlsx, .xls)';
            } else if (error.message.includes('413')) {
                errorMessage = 'El archivo es demasiado grande. Máximo 5MB';
            } else if (error.message.includes('401')) {
                errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente';
            } else if (error.message.includes('403')) {
                errorMessage = 'No tiene permisos para importar equipos';
            } else if (error.message.includes('Respuesta del servidor no válida')) {
                errorMessage = 'Error en el servidor. Intente nuevamente';
            } else if (error.message.includes('No se proporcionó ningún archivo')) {
                errorMessage = 'Error: No se pudo procesar el archivo. Verifique que esté autenticado y el archivo sea válido';
            }

            UI.showNotification(errorMessage, 'error');
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
            console.log('🔍 INICIANDO VALIDACIÓN DE DATOS');
            const mapping = this.getMapping();
            console.log('🗺️ Mapeo obtenido:', mapping);

            const validationData = {
                mapping: mapping,
                data: this.excelData.data
            };
            console.log('📋 Datos de validación:', validationData);

            const response = await API.post('/equipment/validate-import', validationData);
            console.log('📊 Respuesta de validación:', response);

            if (response.success) {
                this.validationResults = response.data;
                console.log('✅ Resultados de validación:', this.validationResults);
                this.displayValidationResults();
                this.nextImportStep();
                console.log('✅ PASO 2 COMPLETADO - Validación completada');
            } else {
                throw new Error(response.message || 'Error en validación');
            }
        } catch (error) {
            console.error('❌ Error validando datos:', error);
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
            console.log('🚀 Iniciando confirmación de importación...');
            console.log('📊 Datos de mapeo:', this.getMapping());
            console.log('📋 Datos a importar:', this.excelData.data.length, 'filas');
            console.log('✅ Resultados de validación:', this.validationResults);

            const importData = {
                mapping: this.getMapping(),
                data: this.excelData.data,
                validation: this.validationResults
            };

            console.log('📦 Datos de importación:', importData);
            console.log('🌐 URL de importación:', '/equipment/import');
            console.log('🔍 Headers de autenticación:', ConfigUtils.getAuthHeaders());

            const response = await API.post('/equipment/import', importData);

            console.log('📡 Respuesta del servidor:', response);

            if (response.success) {
                console.log('✅ Importación exitosa:', response.data);

                UI.showNotification(
                    `Importación completada: ${response.data.imported} equipos`,
                    'success'
                );

                console.log('🔒 Cerrando modal...');
                this.closeImportModal();

                console.log('🔄 Recargando lista de equipos...');
                await this.loadEquipmentList();

                console.log('✅ Proceso de importación completado');
            } else {
                throw new Error(response.message || 'Error en importación');
            }
        } catch (error) {
            console.error('❌ Error en importación:', error);
            UI.showNotification('Error en importación', 'error');
        }
    }

    // Descargar plantilla
    async downloadTemplate() {
        try {
            console.log('📥 Descargando plantilla Excel...');

            const response = await API.get('/equipment/template', { responseType: 'blob' });

            console.log('✅ Plantilla descargada:', response);

            const blob = new Blob([response], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'plantilla-equipos.xlsx';

            console.log('📥 Descargando archivo:', link.download);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            UI.showNotification('Plantilla descargada exitosamente', 'success');
            console.log('✅ Plantilla descargada exitosamente');
        } catch (error) {
            console.error('❌ Error descargando plantilla:', error);
            UI.showNotification('Error descargando plantilla', 'error');
        }
    }

    // Exportar a Excel
    async exportToExcel(options = null) {
        // Si no se pasan opciones, abrir modal de configuración
        if (!options) {
            return this.showExportModal();
        }

        try {
            console.log('🚀 Iniciando exportación a Excel con opciones:', options);
            console.log('📊 Filtros actuales:', this.filters);

            // Validaciones previas para evitar archivos vacíos inesperados
            if (options.mode === 'current_page') {
                // Contar usando datos en memoria (más fiable que inspección del DOM)
                let hiddenRows = [];
                try { hiddenRows = JSON.parse(localStorage.getItem('hiddenEquipmentRows') || '[]'); } catch (_) {}
                const visibleDataCount = (this.equipment || []).filter(item => !hiddenRows.includes(item.id)).length;
                if (visibleDataCount === 0) {
                    UI.showNotification('No hay filas visibles para exportar en la página actual', 'warning');
                    return;
                }
            }
            if (options.mode === 'filtered') {
                const countEl = document.getElementById('equipment-count');
                const totalCount = countEl ? parseInt(countEl.textContent || '0', 10) : null;
                if (Number.isInteger(totalCount) && totalCount === 0) {
                    UI.showNotification('No hay resultados para exportar con los filtros actuales', 'warning');
                    return;
                }
            }

            // Base de parámetros según modo
            const queryParams = {};

            if (options.mode !== 'all') {
                if (this.filters.search) queryParams.search = this.filters.search;
                if (this.filters.type) queryParams.type = this.filters.type;
                if (this.filters.status) queryParams.status = this.filters.status;
                if (this.filters.state) {
                    const stateId = this.getStateId(this.filters.state);
                    if (stateId) {
                        queryParams.state_id = stateId;
                    }
                }
            }

            // Alcance: página actual → enviar IDs visibles de la página actual
            if (options.mode === 'current_page') {
                let hiddenRows = [];
                try { hiddenRows = JSON.parse(localStorage.getItem('hiddenEquipmentRows') || '[]'); } catch (_) {}
                const includeIds = (this.equipment || [])
                    .filter(item => !hiddenRows.includes(item.id))
                    .map(item => item.id);
                if (includeIds.length === 0) {
                    UI.showNotification('No hay filas visibles para exportar en la página actual', 'warning');
                    return;
                }
                queryParams.include_ids = includeIds.join(',');
            }

            // Excluir filas ocultas si corresponde
            if (options.includeHidden === false) {
                try {
                    const hiddenRows = JSON.parse(localStorage.getItem('hiddenEquipmentRows') || '[]');
                    if (Array.isArray(hiddenRows) && hiddenRows.length > 0) {
                        queryParams.exclude_ids = hiddenRows.join(',');
                    }
                } catch (e) {
                    console.warn('⚠️ No fue posible leer filas ocultas desde localStorage');
                }
            }

            // Columnas seleccionadas
            if (Array.isArray(options.columns) && options.columns.length > 0) {
                queryParams.columns = options.columns.join(',');
            }

            // Modo de exportación
            queryParams.export_mode = options.mode || 'filtered';

            const params = new URLSearchParams(queryParams);
            const exportUrl = params.toString() ? `/equipment/export?${params}` : '/equipment/export';
            console.log('🔗 URL completa:', exportUrl);

            const response = await API.get(exportUrl, { responseType: 'blob' });

            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `equipos-${new Date().toISOString().split('T')[0]}.xlsx`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            UI.showNotification('Exportación completada', 'success');
        } catch (error) {
            console.error('❌ Error exportando:', error);
            UI.showNotification('Error en exportación', 'error');
        }
    }

    // Modal de exportación con opciones
    showExportModal() {
        // Cargar preferencias previas
        let savedPrefs = null;
        try {
            const allPrefs = JSON.parse(localStorage.getItem('exportPreferences') || '{}');
            savedPrefs = allPrefs && allPrefs.equipment ? allPrefs.equipment : null;
        } catch (e) {}

        const defaultSelected = ['inventory_number', 'name', 'type', 'brand', 'model', 'status', 'state_name', 'assigned_to'];
        const selectedColumns = savedPrefs?.columns && savedPrefs.columns.length > 0 ? savedPrefs.columns : defaultSelected;
        const selectedMode = savedPrefs?.mode || 'filtered';
        const includeHiddenDefault = savedPrefs?.includeHidden ?? false;

        const columnsHTML = this.availableExportColumns.map(col => `
            <label class="checkbox-item">
                <input type="checkbox" name="export-columns" value="${col.key}" ${selectedColumns.includes(col.key) ? 'checked' : ''}>
                <span>${col.label}</span>
            </label>
        `).join('');

        const content = `
            <div class="export-settings" style="display:grid; gap:24px;">
                <div style="background: var(--color-background-secondary); border:1px solid var(--color-border); border-radius: var(--border-radius-lg); padding: 16px;">
                    <h4 style="margin:0 0 12px; color: var(--color-text-primary); font-weight:600;">Alcance</h4>
                    <div class="radio-group" style="display:flex; gap:16px; align-items:center; color: var(--color-text-primary);">
                        <label class="radio-item" style="display:flex; gap:8px; align-items:center;">
                            <input type="radio" name="export-mode" value="filtered" ${selectedMode === 'filtered' ? 'checked' : ''}>
                            <span>Vista actual (búsqueda y filtros)</span>
                        </label>
                        <label class="radio-item" style="display:flex; gap:8px; align-items:center;">
                            <input type="radio" name="export-mode" value="current_page" ${selectedMode === 'current_page' ? 'checked' : ''}>
                            <span>Solo página actual</span>
                        </label>
                        <label class="radio-item" style="display:flex; gap:8px; align-items:center;">
                            <input type="radio" name="export-mode" value="all" ${selectedMode === 'all' ? 'checked' : ''}>
                            <span>Todo el inventario</span>
                        </label>
                    </div>
                    <label class="checkbox-item" style="margin-top:12px; display:flex; gap:8px; align-items:center; color: var(--color-text-primary);">
                        <input type="checkbox" id="include-hidden-rows" ${includeHiddenDefault ? 'checked' : ''}>
                        <span>Incluir filas ocultas</span>
                    </label>
                </div>
                <div style="background: var(--color-background-secondary); border:1px solid var(--color-border); border-radius: var(--border-radius-lg); padding: 16px;">
                    <h4 style="margin:0 0 12px; color: var(--color-text-primary); font-weight:600;">Columnas a exportar</h4>
                    <div class="columns-grid" style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:12px; color: var(--color-text-primary);">
                        ${columnsHTML}
                    </div>
                    <div style="display:flex; gap:8px; margin-top:12px;">
                        <button class="btn btn-secondary" type="button" id="select-all-columns">Seleccionar todas</button>
                        <button class="btn btn-outline" type="button" id="deselect-all-columns">Deseleccionar todas</button>
                    </div>
                </div>
            </div>
        `;

        const modal = window.Modal.create(content, {
            title: 'Exportar Equipos',
            footerButtons: '<button class="btn btn-primary" id="confirm-export">Exportar</button>'
        });

        // Handlers del modal
        const root = modal.element;
        const selectAllBtn = root.querySelector('#select-all-columns');
        const deselectAllBtn = root.querySelector('#deselect-all-columns');
        const confirmBtn = root.querySelector('#confirm-export');

        const getSelectedColumns = () => Array.from(root.querySelectorAll('input[name="export-columns"]:checked')).map(i => i.value);
        const getSelectedMode = () => (root.querySelector('input[name="export-mode"]:checked')?.value || 'filtered');
        const getIncludeHidden = () => root.querySelector('#include-hidden-rows')?.checked ?? false;

        if (selectAllBtn) selectAllBtn.addEventListener('click', () => {
            root.querySelectorAll('input[name="export-columns"]').forEach(i => i.checked = true);
        });
        if (deselectAllBtn) deselectAllBtn.addEventListener('click', () => {
            root.querySelectorAll('input[name="export-columns"]').forEach(i => i.checked = false);
        });
        if (confirmBtn) confirmBtn.addEventListener('click', async () => {
            const mode = getSelectedMode();
            const columns = getSelectedColumns();
            const includeHidden = getIncludeHidden();

            // Guardar preferencias
            try {
                const allPrefs = JSON.parse(localStorage.getItem('exportPreferences') || '{}');
                allPrefs.equipment = { mode, columns, includeHidden };
                localStorage.setItem('exportPreferences', JSON.stringify(allPrefs));
            } catch (e) {}

            modal.close();
            await this.exportToExcel({ mode, columns, includeHidden });
        });
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
        if (modal) {
            modal.style.display = 'none';

            // Limpiar estado del modal
            this.currentStep = 1;
            this.excelData = null;
            this.mapping = {};
            this.validationResults = null;

            // Resetear pasos de importación
            document.querySelectorAll('.import-step').forEach(el => {
                el.classList.remove('active');
            });

            // Mostrar primer paso
            const firstStep = document.getElementById('import-step-1');
            if (firstStep) {
                firstStep.classList.add('active');
            }

            // Resetear botones
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const confirmBtn = document.getElementById('confirm-btn');

            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'block';
            if (confirmBtn) confirmBtn.style.display = 'none';

            // Limpiar archivo seleccionado
            const fileInput = document.getElementById('excel-file');
            if (fileInput) {
                fileInput.value = '';
            }

            // Limpiar mapeo de columnas
            const mappingTbody = document.getElementById('mapping-tbody');
            if (mappingTbody) {
                mappingTbody.innerHTML = '';
            }

            // Limpiar resultados de validación
            const validCount = document.getElementById('valid-count');
            const errorCount = document.getElementById('error-count');
            const errorsContainer = document.getElementById('validation-errors');

            if (validCount) validCount.textContent = '0';
            if (errorCount) errorCount.textContent = '0';
            if (errorsContainer) errorsContainer.innerHTML = '';
        }
    }

    // Actualizar lista: también restaura filas ocultas
    refreshList() {
        // Limpia la persistencia de filas ocultas y recarga la tabla
        this.showAllRows();
        // Actualiza estadísticas si están disponibles
        if (typeof this.loadEquipmentStats === 'function') {
            this.loadEquipmentStats();
        }
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

            // Usar la nueva función auxiliar para manejar errores
            this.handleEquipmentError(error, 'refresco de lista de equipos');

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

            // Usar la nueva función auxiliar para manejar errores
            this.handleEquipmentError(error, 'carga de estados');

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

    // Función auxiliar para manejar errores sin logout automático
    handleEquipmentError(error, context = 'operación') {
        console.error(`Error en ${context}:`, error);

        let errorMessage = `Error en ${context}`;

        if (error.message.includes('401')) {
            errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
            // No ejecutar logout automático, solo mostrar el mensaje
            UI.showNotification(errorMessage, 'error');
            return false; // Indicar que hubo error de autenticación
        } else if (error.message.includes('403')) {
            errorMessage = `No tiene permisos para realizar esta ${context}.`;
        } else if (error.message.includes('422')) {
            errorMessage = 'Datos inválidos. Por favor verifique la información.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Error interno del servidor. Intente nuevamente.';
        } else {
            errorMessage = error.message || `Error desconocido en ${context}.`;
        }

        UI.showNotification(errorMessage, 'error');
        return true; // Indicar que el error fue manejado
    }
}

// Función global de respaldo para eliminar equipo
window.deleteEquipmentGlobal = function (equipmentId) {
    console.log('🔍 deleteEquipmentGlobal llamado con ID:', equipmentId);
    if (window.Equipment && window.Equipment.deleteEquipment) {
        return window.Equipment.deleteEquipment(equipmentId);
    } else {
        console.error('❌ Equipment no está disponible');
        alert('Error: Equipment no está disponible. Recargando página...');
        location.reload();
    }
};

// Función global de respaldo para editar equipo
window.editEquipmentGlobal = function (equipmentId) {
    console.log('🔍 editEquipmentGlobal llamado con ID:', equipmentId);
    if (window.Equipment && window.Equipment.showCreateForm) {
        return window.Equipment.showCreateForm(equipmentId);
    } else {
        console.error('❌ Equipment no está disponible');
        alert('Error: Equipment no está disponible. Recargando página...');
        location.reload();
    }
};

// Inicializar módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Creando instancia de Equipment...');
    // Crear instancia de Equipment (una sola vez)
    window.Equipment = new Equipment();

    function tryInitEquipment() {
        if (window.Auth && window.Auth.isAuthenticated && window.Equipment && typeof window.Equipment.init === 'function') {
            if (!window.Equipment._alreadyInitialized) {
                try {
                    window.Equipment.init();
                    window.Equipment._alreadyInitialized = true;
                    console.log('✅ Equipment inicializado correctamente');
                } catch (error) {
                    console.error('❌ Error durante la inicialización de Equipment:', error);
                    setTimeout(tryInitEquipment, 1000);
                }
            }
        } else {
            // Si Auth o método init aún no están listos, reintentar pronto
            setTimeout(tryInitEquipment, 200);
        }
    }

    // Intentar inicializar inmediatamente (por si Auth ya está listo)
    tryInitEquipment();

    // Observar cambios en Auth.isAuthenticated si Auth existe
    if (window.Auth) {
        let lastAuth = !!window.Auth.isAuthenticated;
        setInterval(() => {
            if (!window.Equipment._alreadyInitialized && window.Auth.isAuthenticated && !lastAuth) {
                tryInitEquipment();
            }
            lastAuth = !!window.Auth.isAuthenticated;
        }, 300);
    }

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
        'refreshList',
        'cleanState'  // Agregar el nuevo método
    ];

    methodsToBind.forEach(method => {
        if (window.Equipment[method]) {
            window.Equipment[method] = window.Equipment[method].bind(window.Equipment);
        }
    });

    console.log('✅ Equipment inicializado y métodos disponibles globalmente');
    console.log('🔍 Métodos disponibles:', methodsToBind);
    // Notificar al resto de módulos que Equipment ya está listo
    try {
        window.isEquipmentReady = true;
        document.dispatchEvent(new Event('equipment-ready'));
    } catch (e) {
        console.warn('⚠️ No se pudo despachar evento equipment-ready:', e);
    }
});
