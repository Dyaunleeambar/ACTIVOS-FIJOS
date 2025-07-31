// Módulo de Autenticación
const Auth = {
    // Estado de autenticación
    isAuthenticated: false,
    currentUser: null,
    
    // Inicializar autenticación
    init: function() {
        this.checkAuthStatus();
        this.setupEventListeners();
    },
    
    // Verificar estado de autenticación
    checkAuthStatus: function() {
        const token = ConfigUtils.getAuthToken();
        const userData = ConfigUtils.getUserData();
        
        if (token && userData) {
            this.isAuthenticated = true;
            this.currentUser = userData;
            this.showApp();
        } else {
            this.isAuthenticated = false;
            this.currentUser = null;
            this.showLogin();
        }
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // User menu
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', () => {
                userDropdown.classList.toggle('active');
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }
        
        // Change password link
        const changePasswordLink = document.getElementById('change-password-link');
        if (changePasswordLink) {
            changePasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showChangePasswordModal();
            });
        }
    },
    
    // Manejar login
    handleLogin: async function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('login-error');
        
        // Validaciones básicas
        if (!username || !password) {
            this.showLoginError('Por favor complete todos los campos');
            return;
        }
        
        try {
            // Mostrar loading
            this.showLoginLoading(true);
            
            const response = await fetch(ConfigUtils.getApiUrl('/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Login exitoso
                ConfigUtils.setAuthToken(data.token);
                ConfigUtils.setUserData(data.user);
                
                this.isAuthenticated = true;
                this.currentUser = data.user;
                
                // Mostrar notificación de éxito
                UI.showNotification('Login exitoso', 'success');
                
                // Mostrar aplicación
                this.showApp();
                
                // Limpiar formulario
                document.getElementById('login-form').reset();
                
            } else {
                // Error en login
                this.showLoginError(data.error || 'Error en las credenciales');
            }
            
        } catch (error) {
            console.error('Error en login:', error);
            this.showLoginError('Error de conexión. Intente nuevamente.');
        } finally {
            this.showLoginLoading(false);
        }
    },
    
    // Manejar logout
    handleLogout: async function() {
        try {
            // Llamar al endpoint de logout
            await fetch(ConfigUtils.getApiUrl('/auth/logout'), {
                method: 'POST',
                headers: ConfigUtils.getAuthHeaders()
            });
        } catch (error) {
            console.error('Error en logout:', error);
        }
        
        // Limpiar datos locales
        ConfigUtils.removeAuthToken();
        ConfigUtils.removeUserData();
        
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Mostrar login
        this.showLogin();
        
        // Mostrar notificación
        UI.showNotification('Sesión cerrada exitosamente', 'info');
    },
    
    // Mostrar página de login
    showLogin: function() {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
        document.getElementById('loading-screen').style.display = 'none';
    },
    
    // Mostrar aplicación
    showApp: function() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        document.getElementById('loading-screen').style.display = 'none';
        
        // Actualizar información del usuario
        this.updateUserInfo();
        
        // Inicializar aplicación
        if (window.App) {
            App.init();
        }
    },
    
    // Actualizar información del usuario en la UI
    updateUserInfo: function() {
        if (!this.currentUser) return;
        
        // Actualizar nombre de usuario en el header
        const userNameElement = document.getElementById('user-name');
        const userFullNameElement = document.getElementById('user-full-name');
        const userRoleElement = document.getElementById('user-role');
        
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.username;
        }
        
        if (userFullNameElement) {
            userFullNameElement.textContent = this.currentUser.full_name;
        }
        
        if (userRoleElement) {
            userRoleElement.textContent = ConfigUtils.getUserRoleText(this.currentUser.role);
        }
    },
    
    // Mostrar error de login
    showLoginError: function(message) {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Ocultar error después de 5 segundos
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    },
    
    // Mostrar/ocultar loading en login
    showLoginLoading: function(show) {
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        if (submitBtn) {
            if (show) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';
                submitBtn.disabled = true;
            } else {
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
                submitBtn.disabled = false;
            }
        }
    },
    
    // Verificar token
    verifyToken: async function() {
        try {
            const response = await fetch(ConfigUtils.getApiUrl('/auth/verify'), {
                method: 'GET',
                headers: ConfigUtils.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.valid) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error verificando token:', error);
            return false;
        }
    },
    
    // Renovar token automáticamente
    refreshToken: async function() {
        // Implementar renovación automática de token si es necesario
        console.log('Renovando token...');
    },
    
    // Mostrar modal de cambio de contraseña
    showChangePasswordModal: function() {
        const modalContent = `
            <div class="form-container">
                <h3>Cambiar Contraseña</h3>
                <form id="change-password-form">
                    <div class="form-group">
                        <label for="current-password">
                            <i class="fas fa-lock"></i>
                            Contraseña Actual
                        </label>
                        <input type="password" id="current-password" name="currentPassword" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="new-password">
                            <i class="fas fa-key"></i>
                            Nueva Contraseña
                        </label>
                        <input type="password" id="new-password" name="newPassword" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm-password">
                            <i class="fas fa-check"></i>
                            Confirmar Nueva Contraseña
                        </label>
                        <input type="password" id="confirm-password" name="confirmPassword" required>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            Cambiar Contraseña
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        UI.showModal('Cambiar Contraseña', modalContent);
        
        // Configurar event listener para el formulario
        const form = document.getElementById('change-password-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChangePassword();
            });
        }
    },
    
    // Manejar cambio de contraseña
    handleChangePassword: async function() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validaciones
        if (!currentPassword || !newPassword || !confirmPassword) {
            UI.showNotification('Por favor complete todos los campos', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            UI.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            UI.showNotification('La nueva contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        try {
            const response = await fetch(ConfigUtils.getApiUrl('/auth/change-password'), {
                method: 'POST',
                headers: ConfigUtils.getAuthHeaders(),
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                UI.showNotification('Contraseña cambiada exitosamente', 'success');
                UI.closeModal();
                
                // Limpiar formulario
                document.getElementById('change-password-form').reset();
                
            } else {
                UI.showNotification(data.error || 'Error al cambiar contraseña', 'error');
            }
            
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            UI.showNotification('Error de conexión', 'error');
        }
    },
    
    // Verificar permisos
    hasPermission: function(permission) {
        if (!this.currentUser) return false;
        
        // Implementar lógica de permisos según el rol
        const role = this.currentUser.role;
        
        switch (permission) {
            case 'admin':
                return role === 'admin';
            case 'manager':
                return role === 'admin' || role === 'manager';
            case 'consultant':
                return role === 'admin' || role === 'manager' || role === 'consultant';
            default:
                return false;
        }
    },
    
    // Obtener rol actual
    getCurrentRole: function() {
        return this.currentUser ? this.currentUser.role : null;
    },
    
    // Obtener ID del estado del usuario (para managers)
    getUserStateId: function() {
        return this.currentUser ? this.currentUser.state_id : null;
    }
};

// Inicializar autenticación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Exportar módulo de autenticación
window.Auth = Auth; 