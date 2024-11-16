/*
Manuel Alejandro Grisales Pescador
John Esteban Perdomo
Andy Santiago Cano Arteaga 

*/ 
document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskTable = document.getElementById('taskTable').querySelector('tbody');
    let tasks = [];

    
    console.log("Started")

    async function FetchData() {
        try {
          const response = await fetch('/data');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          //console.log(data[0]['Task']); // Do something with the data
          //console.log(data); // Do something with the data

          for (let index = 0; index < data.length; index++) {
            console.log(data[index]['Task']);
            addTask((data[index]['_id']).toString(), data[index]['Task']);

          }
          renderTasks();
          console.log(tasks);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

    FetchData()


    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const task = taskInput.value.trim();
        if (task !== '') {
            addTaskPage(task);
            taskInput.value = '';
            renderTasks();
        }
    });

    function addTask(Id, task) {
        tasks.push({ id: Id.toString(), name: task });
    }

    function addTaskPage(task) {
        AddTask(task)
    }

    async function AddTask(task) {
        try {
            const response = await fetch('/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Task: task }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Added:', result);

            // Add the new task to the UI
            //tasks.push({ id: result.documentId, name: task });
            addTask(result.documentId, task)
            renderTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    function editTask(id) {
        console.log('Edit Id:')
        const newTask = prompt('Editar tarea:', tasks.find(task => task.id === id).name);
        if (newTask !== null && newTask.trim() !== '') {
            updateData(id, newTask)
        }
    }

    function deleteTask(id) {
        DELETETask(id);
    }

    async function DELETETask(id) {
        try {
            const response = await fetch(`/data/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(result.message);

            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            return false;
        }
    }

    function renderTasks() {
        taskTable.innerHTML = '';
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td>
                    <button class="edit" onclick="editTask('${task.id}')">Editar</button>
                    <button class="delete" onclick="deleteTask('${task.id}')">Eliminar</button>
                </td>
            `;
            taskTable.appendChild(row);
        });
    }


    async function updateData(id, updateData) {
        console.log('New Data:', updateData)
        console.log('Id:', id)

        try {
            const response = await fetch(`/data/${id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Task: updateData }), // Use the correct key 'Task'
              });
          
          console.log('Response:', response);
  
          const result = await response.json();
          console.log('Result', result);
          if (result['message'] == 'Document updated') {
            tasks = tasks.map(task => task.id === id ? { ...task, name: updateData } : task);
            renderTasks();
          }
        } catch (error) {
          console.error('Error updating data:', error);
        }
      }


    


    // Para que las funciones editTask y deleteTask estén disponibles en el DOM
    window.editTask = editTask;
    window.deleteTask = deleteTask;
});




document.getElementById('fetch-data').addEventListener('click', async () => {
    try {
        console.log('Fetching data from /data');
        const response = await fetch('/data');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        document.getElementById('data').innerHTML = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
