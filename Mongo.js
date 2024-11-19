// Importa los módulos necesarios
const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

// Crea una instancia de Express
const app = express();
const port = 5000; // Puerto donde se ejecutará el servidor

// URI de conexión a MongoDB Atlas
const uri = "mongodb+srv://Andy:Xkfq@cluster0.dnnnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Nombre de la base de datos y la colección
const databaseName = 'RecursosHumanos';
const collectionName = 'Empleados';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(express.json());
app.use(cors()); // Habilita CORS para solicitudes cross-origin
app.use(express.static(__dirname)); // Sirve archivos estáticos desde el directorio actual

// Conecta y devuelve la colección de empleados
async function getCollection() {
    await client.connect();
    const database = client.db(databaseName);
    return database.collection(collectionName);
}

// Ruta para actualizar un empleado
app.put('/data/:id', async (req, res) => {
  const { id } = req.params; // Obtiene el ID del empleado desde los parámetros de la ruta
  const updatedData = {
      Nombre: req.body.Nombre,
      Apellidos: req.body.Apellidos,
  };

  try {
      const collection = await getCollection();
      const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
      );

      if (result.modifiedCount === 1) {
          res.json({ message: 'Empleado actualizado con éxito' });
      } else {
          res.status(404).json({ message: 'Empleado no encontrado' });
      }
  } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      res.status(500).json({ error: 'Error al actualizar el empleado' });
  }
});

// Ruta para obtener datos de empleados desde MongoDB
app.get('/data', async (req, res) => {
    try {
        const collection = await getCollection();
        
        // Obtén todos los documentos de la colección
        const documents = await collection.find({}).toArray();

        // Devuelve los documentos como respuesta JSON
        res.json(documents);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).send('Error al obtener los datos');
    }
});

// Ruta para agregar un nuevo empleado
app.post('/data', async (req, res) => {
    const newEmployee = {
        Cedula: req.body.Cedula,
        Apellidos: req.body.Apellidos,
        Nombre: req.body.Nombre,
        Telefono: req.body.Telefono,
        EstadoCivil: req.body.EstadoCivil,
        Direccion: req.body.Direccion,
        FechaNacimiento: req.body.FechaNacimiento,
        Cargo: req.body.Cargo,
        FechaIngreso: req.body.FechaIngreso,
        Salario: req.body.Salario,
        HorasExtras: req.body.HorasExtras,
        Arl: req.body.Arl,
        TipoContrato: req.body.TipoContrato,
        PruebaDesempeño: req.body.PruebaDesempeño,
        FechaRetiro: req.body.FechaRetiro
    };

    try {
        const collection = await getCollection();
        const result = await collection.insertOne(newEmployee);

        res.status(201).json({
            message: 'Empleado agregado con éxito',
            documentId: result.insertedId,
        });
    } catch (error) {
        console.error("Error al agregar el empleado:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para eliminar un empleado
app.delete('/data/:id', async (req, res) => {
  const { id } = req.params; // Obtiene el ID del empleado desde los parámetros de la ruta

  try {
      const collection = await getCollection();
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
          res.json({ message: 'Empleado eliminado con éxito' });
      } else {
          res.status(404).json({ message: 'Empleado no encontrado' });
      }
  } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      res.status(500).json({ error: 'Error al eliminar el empleado' });
  }
});


// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML/formulario_entrada.html')); // Sirve el archivo HTML principal
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

