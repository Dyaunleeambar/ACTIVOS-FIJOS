# Análisis de Requerimientos - Sistema de Gestión de Medios Informáticos

## 1. Información General del Proyecto

### 1.1 Contexto del Negocio
- **Empresa**: Empresa de servicios de mantenimiento al sistema electroenergético
- **Tamaño**: 75-100 empleados
- **Cobertura**: 5 estados del país + capital del país (ubicación del responsable de IT)
- **Estructura IT**: 1 responsable centralizado en la capital + responsables de medios por estado

### 1.2 Problema Actual
- Comunicación manual entre estados y IT central (llamadas, WhatsApp, Telegram)
- Falta de control centralizado de inventario
- Ausencia de seguimiento sistemático de asignaciones de equipos
- Gestión manual de asignaciones de equipos
- Falta de control de seguridad y acceso

## 2. Objetivos del Sistema

### 2.1 Objetivos Principales
- ✅ Control de inventario y ubicación de equipos
- ✅ Gestión de asignación de equipos a empleados
- ✅ Control de acceso y seguridad de equipos
- ✅ Generación de reportes por estado
- ✅ Gestión de propuestas de baja por desuso o rotura

### 2.2 Objetivos Secundarios
- Centralizar la información de medios informáticos
- Automatizar reportes mensuales
- Preparar la base para futura integración con sistema completo de IT

## 3. Requerimientos Funcionales

### 3.1 Gestión de Inventario
**RF-001**: El sistema debe permitir registrar equipos informáticos con:
- Datos técnicos (marca, modelo, especificaciones)
- Número de inventario único
- Datos de ubicación (estado) y asignación
- Datos de seguridad (usuarios, contraseñas, acceso)

**Tipos de equipos soportados**:
- Desktop, Laptop, Printer, Server, Router, Switch
- Radios de comunicación
- CHIPS SIM de telefonía móvil
- ROAMING
- Other (otros tipos)

**RF-002**: El sistema debe permitir actualizar el estado de los equipos:
- Activo
- En mantenimiento
- Fuera de servicio
- Dado de baja

**RF-003**: El sistema debe permitir registrar movimientos de ubicación de equipos

### 3.2 Gestión de Asignaciones
**RF-004**: El sistema debe permitir asignar equipos a empleados específicos
- Decisión del IT central
- Sin flujo de aprobación adicional

**RF-005**: El sistema debe mantener historial de asignaciones
- Fecha de asignación/desasignación
- Responsable de la asignación

**RF-006**: El sistema debe permitir generar actas de responsabilidad

**RF-007**: El sistema debe permitir transferencia de equipos entre empleados
- A criterio del IT central

### 3.3 Control de Seguridad
**RF-008**: El sistema debe registrar datos de acceso y seguridad de equipos
- Usuarios
- Contraseñas
- Detalles de acceso

**RF-009**: El sistema debe permitir gestionar usuarios y contraseñas de equipos
- Control de acceso por criterio del IT

### 3.4 Reportes y Alertas
**RF-010**: El sistema debe generar reportes de inventario por estado

**RF-011**: El sistema debe generar reportes de movimientos de ubicación

**RF-012**: El sistema debe generar reportes adicionales:
- Equipos por empleado
- Equipos por tipo
- Equipos por estado

**RF-013**: El sistema debe permitir exportación de reportes en formatos:
- PDF
- Excel

**RF-014**: El sistema debe permitir crear propuestas de baja
- Checklist de selección con categorías:
  - Rotura
  - Obsolescencia
  - Pérdida
- Aprobación por criterio del responsable de IT
- Reporte de motivos basado en la selección

## 4. Requerimientos No Funcionales

### 4.1 Rendimiento
**RNF-001**: El sistema debe responder en menos de 3 segundos para consultas básicas

**RNF-002**: El sistema debe soportar hasta 100 usuarios concurrentes

### 4.2 Seguridad
**RNF-003**: El sistema debe implementar autenticación de usuarios

**RNF-004**: El sistema debe implementar diferentes niveles de acceso

**RNF-005**: Los datos sensibles deben estar encriptados

### 4.3 Usabilidad
**RNF-006**: La interfaz debe ser intuitiva y fácil de usar

**RNF-007**: El sistema debe ser accesible desde navegadores web modernos

### 4.4 Mantenibilidad
**RNF-008**: El código debe seguir estándares de desarrollo

**RNF-009**: El sistema debe ser modular para futuras integraciones

## 5. Tipos de Usuarios

### 5.1 Administrador (IT Central)
- Acceso completo a todas las funcionalidades
- Gestión de usuarios del sistema
- Configuración del sistema
- Reportes ejecutivos
- Ubicado en la capital del país

### 5.2 Responsables de Medios (por Estado)
- Gestión de equipos en su estado
- Reportes de estado de equipos
- Registro de movimientos
- Sin privilegios de administrador

### 5.3 Consultores
- Visualización de equipos asignados
- Consulta de información básica
- Sin capacidad de modificación

## 6. Restricciones Técnicas

### 6.1 Tecnologías Específicas
- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- Backend: Node.js
- Base de Datos: MySQL
- Arquitectura: RESTful API

### 6.2 Restricciones de Presupuesto
- Desarrollo sin presupuesto asignado
- Uso de tecnologías open source

### 6.3 Restricciones de Tiempo
- Desarrollo prioritario sin comprometer calidad
- Implementación por fases

## 7. Priorización de Funcionalidades

### 7.1 Funcionalidades Críticas (Fase 1)
- **RF-001**: Registro de equipos informáticos
- **RF-002**: Gestión de estados de equipos
- **RF-004**: Asignación de equipos a empleados
- **RF-005**: Historial de asignaciones
- **RF-008**: Registro de datos de seguridad
- **RF-010**: Reportes de inventario por estado
- **RNF-003**: Autenticación de usuarios
- **RNF-004**: Niveles de acceso

### 7.2 Funcionalidades Importantes (Fase 2)
- **RF-003**: Registro de movimientos de ubicación
- **RF-006**: Generación de actas de responsabilidad
- **RF-007**: Transferencia de equipos entre empleados
- **RF-011**: Reportes de movimientos
- **RF-012**: Reportes adicionales (por empleado, tipo, estado)
- **RF-013**: Exportación de reportes (PDF, Excel)
- **RF-014**: Propuestas de baja con checklist

### 7.3 Funcionalidades Deseables (Fases Futuras)
- **RF-009**: Gestión avanzada de usuarios y contraseñas
- Integración con otros sistemas de la empresa
- Dashboard con métricas en tiempo real
- Notificaciones automáticas
- App móvil para consultas

## 8. Criterios de Aceptación

### 8.1 Funcionalidad Básica
- [ ] Registro completo de inventario con todos los campos definidos
- [ ] Gestión de asignaciones con historial de fecha y responsable
- [ ] Generación de reportes básicos por estado
- [ ] Control de acceso de usuarios con niveles definidos
- [ ] Propuestas de baja con checklist de categorías

### 8.2 Calidad
- [ ] Interfaz intuitiva y responsive
- [ ] Sistema estable y sin errores críticos
- [ ] Documentación completa
- [ ] Código mantenible y escalable

### 8.3 Despliegue
- [ ] Instalación exitosa en servidor
- [ ] Configuración de base de datos
- [ ] Pruebas de funcionalidad completadas
- [ ] Capacitación de usuarios realizada

## 9. Matriz de Trazabilidad

| ID | Requerimiento | Fuente | Prioridad | Criterios Aceptación | Dependencias |
|----|---------------|--------|-----------|---------------------|--------------|
| RF-001 | Registro equipos | IT Central | Crítica | CA-001, CA-002 | - |
| RF-002 | Estados equipos | IT Central | Crítica | CA-003 | RF-001 |
| RF-003 | Movimientos ubicación | Responsables | Importante | CA-004 | RF-001 |
| RF-004 | Asignación equipos | IT Central | Crítica | CA-005, CA-006 | RF-001 |
| RF-005 | Historial asignaciones | IT Central | Crítica | CA-007 | RF-004 |
| RF-006 | Actas responsabilidad | IT Central | Importante | CA-008 | RF-004 |
| RF-007 | Transferencia equipos | IT Central | Importante | CA-009 | RF-004 |
| RF-008 | Datos seguridad | IT Central | Crítica | CA-010 | RF-001 |
| RF-010 | Reportes inventario | IT Central | Crítica | CA-011 | RF-001 |
| RF-011 | Reportes movimientos | Responsables | Importante | CA-012 | RF-003 |
| RF-012 | Reportes adicionales | IT Central | Importante | CA-013 | RF-001 |
| RF-013 | Exportación reportes | IT Central | Importante | CA-014 | RF-010, RF-011, RF-012 |
| RF-014 | Propuestas baja | IT Central | Importante | CA-015 | RF-001 |

---

*Documento de Análisis de Requerimientos - Versión 2.0 (Validada)* 