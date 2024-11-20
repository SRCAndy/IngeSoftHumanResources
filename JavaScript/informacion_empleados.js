/*
Manuel Alejandro Grisales Pescador
John Esteban Perdomo
Andy Santiago Cano Arteaga
*/

document.addEventListener('DOMContentLoaded', function () {
    const employeeForm = document.getElementById('employeeForm');
    const employeeInput = document.getElementById('employeeInput');
    const employeeTableBody = document.getElementById('employeeTable').querySelector('tbody');
    let employees = []; // Lista para almacenar la información de los empleados

    console.log("Client-side script loaded");

    // Función para obtener datos de empleados desde el servidor
    async function fetchEmployeeData() {
        try {
            const response = await fetch('/data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Cargar los datos iniciales desde el servidor
            data.forEach(employee => {
                addEmployeeToList(
                    employee._id,
                    employee.Cedula,
                    employee.Apellidos,
                    employee.Nombre,
                    employee.Telefono,
                    employee.Cargo,
                    employee.Direccion,
                    employee.FechaIngreso,
                    employee.TipoContrato,
                    employee.Salario,
                    employee.Arl
                );
            });

            renderEmployeeTable();
            console.log(employees);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchEmployeeData();

    // Maneja el evento de envío del formulario
    employeeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const employeeName = employeeInput.value.trim();
        if (employeeName !== '') {
            addEmployeeToPage(employeeName);
            employeeInput.value = '';
            renderEmployeeTable();
        }
    });

    // Agrega un empleado a la lista
    function addEmployeeToList(employeeId, cedula, apellidos, nombre, telefono, cargo, direccion, fechaingreso, tipocontrato, salario, arl) {
        employees.push({
            id: employeeId,
            cedula,
            apellidos,
            nombre,
            telefono,
            cargo,
            direccion,
            fechaingreso,
            tipocontrato,
            salario,
            arl
        });
    }

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2); // Get last 2 digits of year
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const day = today.getDate().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    // Agrega un empleado a la base de datos y la página
    function addEmployeeToPage(nombreEmpleado) {
        saveEmployeeToDatabase(nombreEmpleado);
    }

    async function saveEmployeeToDatabase(nombreEmpleado) {
        try {
            const response = await fetch('/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nombre: nombreEmpleado,
                    Apellidos: '', // Campo opcional
                    Cedula: '', // Campo opcional
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Added:', result);

            // Agrega el nuevo empleado a la lista
            addEmployeeToList(result.documentId, '', '', nombreEmpleado);
            renderEmployeeTable();
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    }

     async function removeEmployeeFromDatabase(employeeId) {
         try {
             // Show confirmation dialog
             if (!confirm('¿Está seguro que desea eliminar este empleado?')) {
                return;
            }
    
            const response = await fetch(`/data/${employeeId}`, {
                 method: 'DELETE',
                 headers: {
                     'Content-Type': 'application/json'
                 }
             });
    
             if (!response.ok) {
                 throw new Error(`Error: ${response.statusText}`);
             }
    
             const result = await response.json();
            
             if (result.message) {
                 // Remove employee from local array
                 employees = employees.filter(emp => emp.id !== employeeId);
                
                 // Update the table display
                 renderEmployeeTable();
                
                 // Show success message
                 alert('Empleado eliminado exitosamente');
             }
         } catch (error) {
             console.error('Error al eliminar empleado:', error);
             alert('Error al eliminar el empleado');
         }
     }
    
    async function Send_dataEmployee(employeeId, selector) {
        const currentEmployee = employees.find(emp => emp.id === employeeId);
        // Datos de prueba básicos (puedes modificar esto para usar un ID específico)
        fechaactual=getCurrentDate()
        const data = {
            nombre: currentEmployee.nombre || "",
            apellidos: currentEmployee.apellidos || "",
            cedula: currentEmployee.cedula || "",
            telefono: currentEmployee.telefono || "",
            direccion: currentEmployee.direccion || "",
            cargo: currentEmployee.cargo || "",
            fechaingreso: currentEmployee.fechaingreso || "",
            tipocontrato:currentEmployee.tipocontrato || "",
            salario:currentEmployee.salario || "",
            arl:currentEmployee.arl || "",
            selector:selector,
            fechaactual:fechaactual

        };
        
        
        console.log(JSON.stringify(data))
        
        try {
            // Realiza la solicitud POST al servidor
            const response = await fetch("http://localhost:8000/documentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            
            // Convierte la respuesta a JSON
            
            
            // Muestra los datos recibidos del servidor
            
            alert("Conexión exitosa con el servidor.");
            
        } catch (error) {
            console.error("Error al intentar conectarse con el servidor:", error);
            alert("Hubo un problema al conectar con el servidor.");
        }
    }
    
    // Función para eliminar un empleado
    function deleteEmployee(employeeId) {
        removeEmployeeFromDatabase(employeeId);
    }

    function searchEmployees() {
        const searchTerm = document.getElementById('employeeSearch').value.toLowerCase();
        const filteredEmployees = employees.filter(emp => 
            emp.nombre.toLowerCase().includes(searchTerm) ||
            emp.apellidos.toLowerCase().includes(searchTerm) ||
            emp.cedula.toLowerCase().includes(searchTerm) ||
            emp.cargo.toLowerCase().includes(searchTerm)
        );
        
        // Clear the current table
        employeeTableBody.innerHTML = '';
        
        // Render filtered results
        filteredEmployees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.nombre || 'N/A'}</td>
                <td>${emp.apellidos || 'N/A'}</td>
                <td>
                    <button class="edit">Editar</button>
                    <button class="delete">Eliminar</button>
                    <button class="generate">Contrato</button>
                    <button class="afiliation">Afiliacion</button>
                    <button class="certificate">Certificado</button>
                </td>
            `;
    
            // Add event listeners
            const editBtn = row.querySelector('.edit');
            const deleteBtn = row.querySelector('.delete');
            const generateBtn = row.querySelector('.generate');
            const afiliationBtn = row.querySelector('.afiliation');
            const certificateBtn = row.querySelector('.certificate');
    
            editBtn.addEventListener('click', () => editEmployee(emp.id));
            deleteBtn.addEventListener('click', () => deleteEmployee(emp.id));
            generateBtn.addEventListener('click', () => Send_dataEmployee(emp.id, '1'));
            afiliationBtn.addEventListener('click', () => Send_dataEmployee(emp.id, '2'));
            certificateBtn.addEventListener('click', () => Send_dataEmployee(emp.id, '3'));
    
            employeeTableBody.appendChild(row);
        });
    }
    
    // Add real-time search capability
    document.getElementById('employeeSearch').addEventListener('input', searchEmployees);
    
    function editEmployee(employeeId) {
        const currentEmployee = employees.find(emp => emp.id === employeeId);

        const editDialog = document.createElement('div');
        editDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;

        editDialog.innerHTML = `
            <h3>Editar Empleado</h3>
            <div>
                <label for="newName">Nombre:</label>
                <input type="text" id="newName" value="${currentEmployee.nombre || ''}" />
            </div>
            <div style="margin-top: 10px;">
                <label for="newLastName">Apellidos:</label>
                <input type="text" id="newLastName" value="${currentEmployee.apellidos || ''}" />
            </div>
            <div style="margin-top: 15px;">
                <button id="saveBtn">Guardar</button>
                <button id="cancelBtn">Cancelar</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(editDialog);

        const saveBtn = editDialog.querySelector('#saveBtn');
        const cancelBtn = editDialog.querySelector('#cancelBtn');

        saveBtn.addEventListener('click', () => {
            const newName = editDialog.querySelector('#newName').value.trim();
            const newLastName = editDialog.querySelector('#newLastName').value.trim();

            if (newName !== '' && newLastName !== '') {
                updateEmployeeData(employeeId, newName, newLastName);
                closeDialog();
            } else {
                alert('Por favor complete todos los campos');
            }
        });

        cancelBtn.addEventListener('click', closeDialog);

        function closeDialog() {
            document.body.removeChild(overlay);
            document.body.removeChild(editDialog);
        }
    }

    async function updateEmployeeData(employeeId, newName, newLastName) {
        try {
            const response = await fetch(`/data/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nombre: newName,
                    Apellidos: newLastName,
                }),
            });

            const result = await response.json();
            if (result.message === 'Empleado actualizado con éxito') {
                employees = employees.map(emp =>
                    emp.id === employeeId
                        ? { ...emp, nombre: newName, apellidos: newLastName }
                        : emp
                );
                renderEmployeeTable();
            }
        } catch (error) {
            console.error('Error updating employee data:', error);
        }
    }

    function renderEmployeeTable() {
        employeeTableBody.innerHTML = '';
        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.nombre || 'N/A'}</td>
                <td>${emp.apellidos || 'N/A'}</td>
                <td>
                    <button class="edit">Editar</button>
                    <button class="delete">Eliminar</button>
                    <button class="generate">Contrato</button>
                    <button class="afiliation">Afiliacion</button>
                    <button class="certificate">Certificado</button>
                </td>
            `;

            const editBtn = row.querySelector('.edit');
            const deleteBtn = row.querySelector('.delete');
            const generateBtn = row.querySelector('.generate');
            const afiliationBtn = row.querySelector('.afiliation');
            const certificateBtn = row.querySelector('.certificate');

            editBtn.addEventListener('click', () => editEmployee(emp.id));
            deleteBtn.addEventListener('click', () => deleteEmployee(emp.id));
            generateBtn.addEventListener('click',() => Send_dataEmployee(emp.id, '1')); 
            afiliationBtn.addEventListener('click',() => Send_dataEmployee(emp.id, '2')); 
            certificateBtn.addEventListener('click',() => Send_dataEmployee(emp.id, '3')); 
                
            employeeTableBody.appendChild(row);
        });
    }
});