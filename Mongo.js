// Import required modules

const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an instance of express
const app = express();
const port = 3000; // You can use any port number you prefer

// Your MongoDB Atlas connection URI
const uri = "";

const DBCluster = 'RecursosHumanos';
const CollectionDatabase = 'Empleados';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Serve static files from the root directory
app.use(express.static(__dirname));


async function getCollection() {
    await client.connect();
    const database = client.db(DBCluster);
    return database.collection(CollectionDatabase);
  }


// API route to fetch data from MongoDB
app.get('/data', async (req, res) => {
    try {
        // Connect to MongoDB
        await client.connect();
        const database = client.db(DBCluster); // Replace with your database name
        const collection = database.collection(CollectionDatabase); // Replace with your collection name


        
        // Fetch data from MongoDB
        const documents = await collection.find({}).toArray();

        // Send data as JSON response
        res.json(documents);
      } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Error fetching data');
      } finally {
          // Close the client connection (optional, can be managed differently for persistent connections)
          await client.close();
      }
  });
  
// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html from the root directory
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.put('/data/:id', async (req, res) => {
    console.log("Database Stage")
    
    const id = req.params.id;
    const updateData = req.body;

    console.log("Id:", id);
    console.log("Data:", updateData['Task']);

    
    try {
      const collection = await getCollection();

      const updateDocument = {
        $set: {
            Task: updateData.Task, // Use updateData.Task to set the correct field
        },
     };

      const result = await collection.updateOne({ _id: new ObjectId(id.toString()) }, updateDocument);
  
      if (result.modifiedCount > 0) {
        res.json({ message: 'Document updated' });
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
        console.log("Error on Database")
      res.status(500).json({ error: error.message });
    }
  });

app.post('/data', async (req, res) => {
    const newTask = req.body.Task;

    try {
        const collection = await getCollection();
        const result = await collection.insertOne({ Task: newTask });

        res.status(201).json({
            message: 'Document added successfully',
            documentId: result.insertedId,
        });
    } catch (error) {
        console.error("Error adding document:", error.message);
        res.status(500).json({ error: error.message });
    }
});

  
app.delete('/data/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const collection = await getCollection();
  
      // Convert the string id to an ObjectId
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount > 0) {
        res.json({ message: 'Document deleted successfully' });
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close(); // Close the connection when done
    }
});