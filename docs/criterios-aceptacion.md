# Criterios de Aceptación - Sistema de Gestión de Medios Informáticos

## 📋 **Criterios de Aceptación por Funcionalidad**

### **CA-001: Registro de Equipos (RF-001)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir registrar equipos con todos los campos obligatorios
- ✅ El número de inventario debe ser único y validado automáticamente
- ✅ Los tipos de equipos deben incluir: Desktop, Laptop, Printer, Server, Router, Switch, Radios de comunicación, CHIPS SIM, ROAMING, Other
- ✅ La ubicación debe especificarse por estado
- ✅ Los datos de seguridad deben incluir usuarios, contraseñas y detalles de acceso
- ✅ El sistema debe mostrar mensaje de éxito al guardar
- ✅ El sistema debe permitir editar equipos existentes
- ✅ El sistema debe validar formatos de datos correctos

**Casos de Prueba:**
1. Registrar un equipo con todos los campos completos
2. Intentar registrar un equipo con número de inventario duplicado
3. Registrar equipos de diferentes tipos
4. Editar información de un equipo existente
5. Validar campos obligatorios

---

### **CA-002: Gestión de Estados de Equipos (RF-002)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir cambiar el estado de un equipo
- ✅ Los estados disponibles deben ser: Activo, En mantenimiento, Fuera de servicio, Dado de baja
- ✅ El sistema debe registrar la fecha y responsable del cambio de estado
- ✅ El sistema debe mostrar el estado actual en todas las vistas de equipos
- ✅ El sistema debe permitir filtrar equipos por estado

**Casos de Prueba:**
1. Cambiar el estado de un equipo activo a en mantenimiento
2. Cambiar el estado de un equipo a fuera de servicio
3. Dar de baja un equipo
4. Filtrar equipos por estado
5. Ver historial de cambios de estado

---

### **CA-003: Registro de Movimientos de Ubicación (RF-003)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir registrar movimientos de equipos entre ubicaciones
- ✅ Cada movimiento debe registrar fecha, origen, destino y responsable
- ✅ El sistema debe actualizar automáticamente la ubicación del equipo
- ✅ El sistema debe mantener historial completo de movimientos
- ✅ El sistema debe permitir consultar movimientos por equipo

**Casos de Prueba:**
1. Registrar movimiento de un equipo entre estados
2. Ver historial de movimientos de un equipo específico
3. Consultar movimientos por fecha
4. Validar que la ubicación se actualiza correctamente

---

### **CA-004: Asignación de Equipos a Empleados (RF-004)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir asignar equipos a empleados específicos
- ✅ La asignación debe ser decisión del IT central (sin flujo de aprobación)
- ✅ El sistema debe registrar fecha y responsable de la asignación
- ✅ El sistema debe permitir desasignar equipos
- ✅ El sistema debe validar que el empleado existe en el sistema

**Casos de Prueba:**
1. Asignar un equipo a un empleado
2. Desasignar un equipo de un empleado
3. Ver equipos asignados a un empleado específico
4. Validar que solo el IT central puede hacer asignaciones

---

### **CA-005: Historial de Asignaciones (RF-005)**

**Criterios de Aceptación:**
- ✅ El sistema debe mantener historial completo de asignaciones
- ✅ Cada registro debe incluir fecha de asignación/desasignación
- ✅ Cada registro debe incluir responsable de la asignación
- ✅ El sistema debe permitir consultar historial por empleado
- ✅ El sistema debe permitir consultar historial por equipo

**Casos de Prueba:**
1. Ver historial completo de asignaciones de un empleado
2. Ver historial completo de asignaciones de un equipo
3. Consultar asignaciones por fecha
4. Exportar historial de asignaciones

---

### **CA-006: Generación de Actas de Responsabilidad (RF-006)**

**Criterios de Aceptación:**
- ✅ El sistema debe generar actas de responsabilidad automáticamente
- ✅ Las actas deben incluir información del empleado y equipos asignados
- ✅ Las actas deben incluir fecha de generación y firma digital
- ✅ El sistema debe permitir descargar actas en formato PDF
- ✅ El sistema debe mantener copia de las actas generadas

**Casos de Prueba:**
1. Generar acta de responsabilidad para un empleado
2. Descargar acta en formato PDF
3. Ver actas generadas por empleado
4. Validar información incluida en las actas

---

### **CA-007: Transferencia de Equipos entre Empleados (RF-007)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir transferir equipos entre empleados
- ✅ La transferencia debe ser a criterio del IT central
- ✅ El sistema debe registrar la transferencia en el historial
- ✅ El sistema debe actualizar automáticamente las asignaciones
- ✅ El sistema debe notificar el cambio a ambos empleados

**Casos de Prueba:**
1. Transferir un equipo de un empleado a otro
2. Verificar que se actualiza el historial
3. Validar que solo el IT central puede hacer transferencias
4. Verificar notificaciones de transferencia

---

### **CA-008: Registro de Datos de Seguridad (RF-008)**

**Criterios de Aceptación:**
- ✅ El sistema debe registrar usuarios de equipos
- ✅ El sistema debe registrar contraseñas de equipos
- ✅ El sistema debe registrar detalles de acceso
- ✅ Los datos sensibles deben estar encriptados
- ✅ Solo usuarios autorizados deben acceder a datos de seguridad

**Casos de Prueba:**
1. Registrar datos de seguridad de un equipo
2. Verificar encriptación de datos sensibles
3. Validar acceso autorizado a datos de seguridad
4. Actualizar datos de seguridad de un equipo

---

### **CA-009: Gestión de Usuarios y Contraseñas (RF-009)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir gestionar usuarios de equipos
- ✅ El sistema debe permitir gestionar contraseñas de equipos
- ✅ El control de acceso debe ser por criterio del IT
- ✅ El sistema debe mantener historial de cambios de credenciales
- ✅ Los datos deben estar protegidos y encriptados

**Casos de Prueba:**
1. Gestionar usuarios de un equipo
2. Gestionar contraseñas de un equipo
3. Ver historial de cambios de credenciales
4. Validar protección de datos sensibles

---

### **CA-010: Reportes de Inventario por Estado (RF-010)**

**Criterios de Aceptación:**
- ✅ El sistema debe generar reportes de inventario por estado
- ✅ Los reportes deben incluir todos los equipos del estado
- ✅ Los reportes deben mostrar información completa de equipos
- ✅ El sistema debe permitir filtrar reportes por tipo de equipo
- ✅ Los reportes deben ser exportables en PDF y Excel

**Casos de Prueba:**
1. Generar reporte de inventario para un estado específico
2. Filtrar reporte por tipo de equipo
3. Exportar reporte en PDF
4. Exportar reporte en Excel
5. Verificar información incluida en reportes

---

### **CA-011: Reportes de Movimientos (RF-011)**

**Criterios de Aceptación:**
- ✅ El sistema debe generar reportes de movimientos de ubicación
- ✅ Los reportes deben incluir fecha, origen, destino y responsable
- ✅ El sistema debe permitir filtrar por período de tiempo
- ✅ El sistema debe permitir filtrar por estado
- ✅ Los reportes deben ser exportables en PDF y Excel

**Casos de Prueba:**
1. Generar reporte de movimientos por período
2. Filtrar movimientos por estado
3. Exportar reporte en PDF
4. Exportar reporte en Excel
5. Verificar información incluida en reportes

---

### **CA-012: Reportes Adicionales (RF-012)**

**Criterios de Aceptación:**
- ✅ El sistema debe generar reportes de equipos por empleado
- ✅ El sistema debe generar reportes de equipos por tipo
- ✅ El sistema debe generar reportes de equipos por estado
- ✅ Los reportes deben incluir información detallada
- ✅ Los reportes deben ser exportables en PDF y Excel

**Casos de Prueba:**
1. Generar reporte de equipos por empleado
2. Generar reporte de equipos por tipo
3. Generar reporte de equipos por estado
4. Exportar reportes en diferentes formatos
5. Verificar información incluida en reportes

---

### **CA-013: Exportación de Reportes (RF-013)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir exportar reportes en formato PDF
- ✅ El sistema debe permitir exportar reportes en formato Excel
- ✅ Los archivos exportados deben mantener el formato correcto
- ✅ Los archivos exportados deben incluir toda la información
- ✅ El sistema debe mostrar progreso de exportación

**Casos de Prueba:**
1. Exportar reporte en formato PDF
2. Exportar reporte en formato Excel
3. Verificar formato de archivos exportados
4. Verificar información incluida en archivos
5. Validar progreso de exportación

---

### **CA-014: Propuestas de Baja (RF-014)**

**Criterios de Aceptación:**
- ✅ El sistema debe permitir crear propuestas de baja con checklist
- ✅ Las categorías disponibles deben ser: Rotura, Obsolescencia, Pérdida
- ✅ El sistema debe generar reporte de motivos basado en la selección
- ✅ La aprobación debe ser por criterio del responsable de IT
- ✅ El sistema debe mantener historial de propuestas de baja

**Casos de Prueba:**
1. Crear propuesta de baja con checklist
2. Seleccionar categoría de baja
3. Generar reporte de motivos
4. Aprobar propuesta de baja
5. Ver historial de propuestas de baja

---

## 🎯 **Criterios de Aceptación Generales**

### **Funcionalidad Básica**
- [ ] Registro completo de inventario con todos los campos definidos
- [ ] Gestión de asignaciones con historial de fecha y responsable
- [ ] Generación de reportes básicos por estado
- [ ] Control de acceso de usuarios con niveles definidos
- [ ] Propuestas de baja con checklist de categorías

### **Calidad**
- [ ] Interfaz intuitiva y responsive
- [ ] Sistema estable y sin errores críticos
- [ ] Documentación completa
- [ ] Código mantenible y escalable

### **Despliegue**
- [ ] Instalación exitosa en servidor
- [ ] Configuración de base de datos
- [ ] Pruebas de funcionalidad completadas
- [ ] Capacitación de usuarios realizada

---

*Documento de Criterios de Aceptación - Versión 1.0* 