const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Generar token JWT
const generateToken = (user) => {
    const payload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        stateId: user.state_id
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

// Verificar token JWT
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                error: 'Token de acceso requerido'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar que el usuario existe
        const userQuery = `
            SELECT id, username, email, full_name, role, state_id
            FROM users 
            WHERE id = ?
        `;
        const users = await executeQuery(userQuery, [decoded.userId]);
        
        if (users.length === 0) {
            return res.status(401).json({
                error: 'Usuario no encontrado o inactivo'
            });
        }
        
        req.user = users[0];
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token inválido'
            });
        }
        
        console.error('Error en autenticación:', error);
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Autorizar por rol
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Usuario no autenticado'
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'No tiene permisos para realizar esta acción'
            });
        }
        
        next();
    };
};

// Autorizar acceso a equipos
const authorizeEquipmentAccess = async (req, res, next) => {
    try {
        const equipmentId = req.params.id;
        
        if (!equipmentId) {
            return res.status(400).json({
                error: 'ID de equipo requerido'
            });
        }
        
        // Obtener información del equipo
        const equipmentQuery = `
            SELECT e.*, s.name as state_name 
            FROM equipment e 
            LEFT JOIN states s ON e.state_id = s.id 
            WHERE e.id = ?
        `;
        const equipment = await executeQuery(equipmentQuery, [equipmentId]);
        
        if (equipment.length === 0) {
            return res.status(404).json({
                error: 'Equipo no encontrado'
            });
        }
        
        const equipmentData = equipment[0];
        
        // Verificar permisos según el rol
        switch (req.user.role) {
            case 'admin':
                // Admin puede acceder a todos los equipos
                break;
                
            case 'manager':
                // Manager solo puede acceder a equipos de su estado
                if (equipmentData.state_id !== req.user.state_id) {
                    return res.status(403).json({
                        error: 'No tiene permisos para acceder a este equipo'
                    });
                }
                break;
                
            case 'consultant':
                // Consultant solo puede ver equipos asignados a él
                const assignmentQuery = `
                    SELECT id FROM assignments 
                    WHERE equipment_id = ? AND user_id = ? AND returned_at IS NULL
                `;
                const assignments = await executeQuery(assignmentQuery, [equipmentId, req.user.id]);
                
                if (assignments.length === 0) {
                    return res.status(403).json({
                        error: 'No tiene permisos para acceder a este equipo'
                    });
                }
                break;
                
            default:
                return res.status(403).json({
                    error: 'Rol no válido'
                });
        }
        
        // Agregar información del equipo al request
        req.equipment = equipmentData;
        next();
        
    } catch (error) {
        console.error('Error en autorización de equipo:', error);
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

// Verificar permisos específicos
const hasPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Usuario no autenticado'
            });
        }
        
        // Implementar lógica de permisos específicos
        const userRole = req.user.role;
        
        switch (permission) {
            case 'create_equipment':
                if (!['admin', 'manager'].includes(userRole)) {
                    return res.status(403).json({
                        error: 'No tiene permisos para crear equipos'
                    });
                }
                break;
                
            case 'edit_equipment':
                if (!['admin', 'manager'].includes(userRole)) {
                    return res.status(403).json({
                        error: 'No tiene permisos para editar equipos'
                    });
                }
                break;
                
            case 'delete_equipment':
                if (userRole !== 'admin') {
                    return res.status(403).json({
                        error: 'Solo los administradores pueden eliminar equipos'
                    });
                }
                break;
                
            case 'view_reports':
                if (!['admin', 'manager'].includes(userRole)) {
                    return res.status(403).json({
                        error: 'No tiene permisos para ver reportes'
                    });
                }
                break;
                
            case 'manage_users':
                if (userRole !== 'admin') {
                    return res.status(403).json({
                        error: 'Solo los administradores pueden gestionar usuarios'
                    });
                }
                break;
                
            default:
                return res.status(403).json({
                    error: 'Permiso no válido'
                });
        }
        
        next();
    };
};

module.exports = {
    generateToken,
    authenticateToken,
    authorizeRole,
    authorizeEquipmentAccess,
    hasPermission
}; 
