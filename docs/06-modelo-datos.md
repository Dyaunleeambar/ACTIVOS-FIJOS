# Modelo de Datos - Sistema de Gestión de Medios Informáticos

## 1. Diagrama Entidad-Relación

### 1.1 Entidades Principales
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Users     │    │  Equipment  │    │   States    │
│             │    │             │    │             │
│ - id        │    │ - id        │    │ - id        │
│ - username  │    │ - inventory │    │ - name      │
│ - password  │    │ - name      │    │ - code      │
│ - email     │    │ - type      │    │ - is_active │
│ - full_name │    │ - brand     │    └─────────────┘
│ - role      │    │ - model     │
│ - state_id  │    │ - status    │
│ - is_active │    │ - state_id  │
└─────────────┘    │ - assigned  │
                   │ - cost      │
                   └─────────────┘
                        │
                        │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Assignments  │    │ Movements   │    │Disposal     │
│             │    │             │    │Proposals    │
│ - id        │    │ - id        │    │             │
│ - equipment │    │ - equipment │    │ - id        │
│ - user_id   │    │ - from_state│    │ - equipment │
│ - assigned  │    │ - to_state  │    │ - proposed  │
│ - returned  │    │ - moved_by  │    │ - reason    │
│ - notes     │    │ - moved_at  │    │ - status    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 2. Scripts de Creación de Base de Datos

### 2.1 Creación de la Base de Datos
```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS activos_fijos_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE activos_fijos_db;

-- Configurar modo SQL
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
```

### 2.2 Tabla de Estados
```sql
CREATE TABLE states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar estados por defecto
INSERT INTO states (name, code) VALUES
('Estado 1', 'EST1'),
('Estado 2', 'EST2'),
('Estado 3', 'EST3'),
('Estado 4', 'EST4'),
('Estado 5', 'EST5');
```

### 2.3 Tabla de Usuarios
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'consultant') NOT NULL,
    state_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto
INSERT INTO users (username, password, email, full_name, role, state_id) VALUES
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/7KqKqKq', 'admin@empresa.com', 'Administrador del Sistema', 'admin', 1);
```

### 2.4 Tabla de Equipos
```sql
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventory_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('desktop', 'laptop', 'printer', 'server', 'router', 'switch', 'other') NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    specifications TEXT,
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    current_value DECIMAL(10,2),
    status ENUM('active', 'maintenance', 'out_of_service', 'disposed') DEFAULT 'active',
    state_id INT NOT NULL,
    assigned_to INT,
    location_details TEXT,
    security_username VARCHAR(50),
    security_password VARCHAR(255),
    access_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.5 Tabla de Asignaciones
```sql
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.6 Tabla de Movimientos
```sql
CREATE TABLE movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    from_state_id INT,
    to_state_id INT NOT NULL,
    from_location TEXT,
    to_location TEXT,
    moved_by INT NOT NULL,
    moved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (from_state_id) REFERENCES states(id) ON DELETE SET NULL,
    FOREIGN KEY (to_state_id) REFERENCES states(id) ON DELETE RESTRICT,
    FOREIGN KEY (moved_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.7 Tabla de Propuestas de Baja
```sql
CREATE TABLE disposal_proposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    proposed_by INT NOT NULL,
    reason ENUM('damage', 'obsolescence', 'replacement', 'other') NOT NULL,
    description TEXT,
    estimated_cost DECIMAL(10,2),
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (proposed_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2.8 Tabla de Auditoría
```sql
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id INT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 3. Índices para Optimización

### 3.1 Índices Principales
```sql
-- Índices para tabla equipment
CREATE INDEX idx_equipment_inventory ON equipment(inventory_number);
CREATE INDEX idx_equipment_state ON equipment(state_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_equipment_assigned ON equipment(assigned_to);
CREATE INDEX idx_equipment_purchase_date ON equipment(purchase_date);

-- Índices para tabla assignments
CREATE INDEX idx_assignments_equipment ON assignments(equipment_id);
CREATE INDEX idx_assignments_user ON assignments(user_id);
CREATE INDEX idx_assignments_assigned_at ON assignments(assigned_at);
CREATE INDEX idx_assignments_returned_at ON assignments(returned_at);

-- Índices para tabla movements
CREATE INDEX idx_movements_equipment ON movements(equipment_id);
CREATE INDEX idx_movements_from_state ON movements(from_state_id);
CREATE INDEX idx_movements_to_state ON movements(to_state_id);
CREATE INDEX idx_movements_moved_at ON movements(moved_at);

-- Índices para tabla users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_state ON users(state_id);

-- Índices para tabla disposal_proposals
CREATE INDEX idx_disposal_equipment ON disposal_proposals(equipment_id);
CREATE INDEX idx_disposal_status ON disposal_proposals(status);
CREATE INDEX idx_disposal_proposed_by ON disposal_proposals(proposed_by);

-- Índices para tabla audit_log
CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);
```

## 4. Vistas Útiles

### 4.1 Vista de Equipos con Información Completa
```sql
CREATE VIEW v_equipment_complete AS
SELECT 
    e.id,
    e.inventory_number,
    e.name,
    e.type,
    e.brand,
    e.model,
    e.specifications,
    e.purchase_date,
    e.purchase_cost,
    e.current_value,
    e.status,
    e.state_id,
    s.name as state_name,
    e.assigned_to,
    u.full_name as assigned_to_name,
    e.location_details,
    e.created_at,
    e.updated_at
FROM equipment e
LEFT JOIN states s ON e.state_id = s.id
LEFT JOIN users u ON e.assigned_to = u.id;
```

### 4.2 Vista de Asignaciones Activas
```sql
CREATE VIEW v_active_assignments AS
SELECT 
    a.id,
    a.equipment_id,
    e.inventory_number,
    e.name as equipment_name,
    e.type as equipment_type,
    a.user_id,
    u.full_name as user_name,
    u.email as user_email,
    a.assigned_by,
    assigned_by_user.full_name as assigned_by_name,
    a.assigned_at,
    a.notes,
    s.name as state_name
FROM assignments a
JOIN equipment e ON a.equipment_id = e.id
JOIN users u ON a.user_id = u.id
JOIN users assigned_by_user ON a.assigned_by = assigned_by_user.id
JOIN states s ON e.state_id = s.id
WHERE a.returned_at IS NULL;
```

### 4.3 Vista de Reporte de Inventario por Estado
```sql
CREATE VIEW v_inventory_by_state AS
SELECT 
    s.id as state_id,
    s.name as state_name,
    COUNT(e.id) as total_equipment,
    SUM(CASE WHEN e.status = 'active' THEN 1 ELSE 0 END) as active_equipment,
    SUM(CASE WHEN e.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_equipment,
    SUM(CASE WHEN e.status = 'out_of_service' THEN 1 ELSE 0 END) as out_of_service_equipment,
    SUM(CASE WHEN e.status = 'disposed' THEN 1 ELSE 0 END) as disposed_equipment,
    SUM(e.purchase_cost) as total_purchase_cost,
    SUM(e.current_value) as total_current_value
FROM states s
LEFT JOIN equipment e ON s.id = e.state_id
GROUP BY s.id, s.name;
```

## 5. Procedimientos Almacenados

### 5.1 Procedimiento para Calcular Depreciación
```sql
DELIMITER //
CREATE PROCEDURE CalculateDepreciation()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE equipment_id INT;
    DECLARE purchase_cost DECIMAL(10,2);
    DECLARE purchase_date DATE;
    DECLARE current_value DECIMAL(10,2);
    DECLARE years DECIMAL(5,2);
    DECLARE depreciation_rate DECIMAL(3,2) DEFAULT 0.20; -- 20% anual
    
    DECLARE equipment_cursor CURSOR FOR 
        SELECT id, purchase_cost, purchase_date 
        FROM equipment 
        WHERE status != 'disposed' AND purchase_cost > 0;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN equipment_cursor;
    
    read_loop: LOOP
        FETCH equipment_cursor INTO equipment_id, purchase_cost, purchase_date;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calcular años desde la compra
        SET years = DATEDIFF(CURDATE(), purchase_date) / 365.25;
        
        -- Calcular depreciación
        SET current_value = GREATEST(purchase_cost * (1 - depreciation_rate * years), 0);
        
        -- Actualizar valor actual
        UPDATE equipment 
        SET current_value = current_value, updated_at = NOW()
        WHERE id = equipment_id;
        
    END LOOP;
    
    CLOSE equipment_cursor;
END //
DELIMITER ;
```

### 5.2 Procedimiento para Generar Reporte de Movimientos
```sql
DELIMITER //
CREATE PROCEDURE GenerateMovementReport(
    IN start_date DATE,
    IN end_date DATE,
    IN state_id INT
)
BEGIN
    SELECT 
        m.id,
        e.inventory_number,
        e.name as equipment_name,
        e.type as equipment_type,
        from_state.name as from_state_name,
        to_state.name as to_state_name,
        m.from_location,
        m.to_location,
        u.full_name as moved_by_name,
        m.moved_at,
        m.reason
    FROM movements m
    JOIN equipment e ON m.equipment_id = e.id
    LEFT JOIN states from_state ON m.from_state_id = from_state.id
    JOIN states to_state ON m.to_state_id = to_state.id
    JOIN users u ON m.moved_by = u.id
    WHERE m.moved_at BETWEEN start_date AND end_date
    AND (state_id IS NULL OR m.from_state_id = state_id OR m.to_state_id = state_id)
    ORDER BY m.moved_at DESC;
END //
DELIMITER ;
```

## 6. Triggers para Auditoría

### 6.1 Trigger para Auditoría de Equipos
```sql
DELIMITER //
CREATE TRIGGER audit_equipment_insert
AFTER INSERT ON equipment
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, new_values, created_at)
    VALUES ('equipment', NEW.id, 'INSERT', JSON_OBJECT(
        'inventory_number', NEW.inventory_number,
        'name', NEW.name,
        'type', NEW.type,
        'status', NEW.status,
        'state_id', NEW.state_id
    ), NOW());
END //

CREATE TRIGGER audit_equipment_update
AFTER UPDATE ON equipment
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, created_at)
    VALUES ('equipment', NEW.id, 'UPDATE', JSON_OBJECT(
        'inventory_number', OLD.inventory_number,
        'name', OLD.name,
        'type', OLD.type,
        'status', OLD.status,
        'state_id', OLD.state_id
    ), JSON_OBJECT(
        'inventory_number', NEW.inventory_number,
        'name', NEW.name,
        'type', NEW.type,
        'status', NEW.status,
        'state_id', NEW.state_id
    ), NOW());
END //

CREATE TRIGGER audit_equipment_delete
AFTER DELETE ON equipment
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, created_at)
    VALUES ('equipment', OLD.id, 'DELETE', JSON_OBJECT(
        'inventory_number', OLD.inventory_number,
        'name', OLD.name,
        'type', OLD.type,
        'status', OLD.status,
        'state_id', OLD.state_id
    ), NOW());
END //
DELIMITER ;
```

## 7. Datos de Prueba

### 7.1 Insertar Equipos de Prueba
```sql
-- Insertar equipos de ejemplo
INSERT INTO equipment (inventory_number, name, type, brand, model, specifications, purchase_date, purchase_cost, current_value, status, state_id, location_details) VALUES
('INV-001', 'Laptop Dell Latitude', 'laptop', 'Dell', 'Latitude 5520', 'Intel i5, 8GB RAM, 256GB SSD', '2023-01-15', 1200.00, 800.00, 'active', 1, 'Oficina principal'),
('INV-002', 'Desktop HP ProDesk', 'desktop', 'HP', 'ProDesk 600', 'Intel i7, 16GB RAM, 512GB SSD', '2023-02-20', 900.00, 600.00, 'active', 1, 'Sala de reuniones'),
('INV-003', 'Impresora HP LaserJet', 'printer', 'HP', 'LaserJet Pro M404', 'Impresora láser monocromática', '2023-03-10', 300.00, 200.00, 'active', 2, 'Área de impresión'),
('INV-004', 'Servidor Dell PowerEdge', 'server', 'Dell', 'PowerEdge R740', 'Intel Xeon, 32GB RAM, 2TB HDD', '2023-04-05', 5000.00, 3500.00, 'active', 1, 'Sala de servidores'),
('INV-005', 'Router Cisco', 'router', 'Cisco', 'ISR 4321', 'Router empresarial', '2023-05-12', 800.00, 600.00, 'active', 3, 'Sala de telecomunicaciones');
```

### 7.2 Insertar Usuarios de Prueba
```sql
-- Insertar usuarios de ejemplo
INSERT INTO users (username, password, email, full_name, role, state_id) VALUES
('manager1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/7KqKqKq', 'manager1@empresa.com', 'Responsable Estado 1', 'manager', 1),
('manager2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/7KqKqKq', 'manager2@empresa.com', 'Responsable Estado 2', 'manager', 2),
('consultant1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/7KqKqKq', 'consultant1@empresa.com', 'Consultor 1', 'consultant', 1);
```

## 8. Configuración de Backup

### 8.1 Script de Backup Automático
```sql
-- Crear evento para backup automático (ejecutar diariamente a las 2:00 AM)
CREATE EVENT IF NOT EXISTS daily_backup
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Aquí irían los comandos de backup
    -- mysqldump activos_fijos_db > backup_$(date +%Y%m%d_%H%M%S).sql
END;
```

## 9. Configuración Final

### 9.1 Confirmar Transacciones
```sql
COMMIT;
```

### 9.2 Verificar Estructura
```sql
-- Verificar que todas las tablas se crearon correctamente
SHOW TABLES;

-- Verificar índices
SHOW INDEX FROM equipment;
SHOW INDEX FROM users;
SHOW INDEX FROM assignments;
SHOW INDEX FROM movements;
```

---

*Modelo de Datos - Versión 1.0* 