require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { Server } = require("socket.io");
const { createServer } = require("http");
const { title } = require('process');

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://task-flow-c8b5e.web.app"],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

//middlewares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhbw5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db('task-sync').collection('users');
    const taskCollection = client.db('task-sync').collection('tasks');
    const activityCollection = client.db('task-sync').collection('activities');

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    const sendTasks = async (email) => {
      result = await taskCollection.find({ addedBy: email }).sort({ _id: -1 }).toArray();
      io.emit('tasks', result);
      console.log(result);
    }

    //user related api
    app.put('/users', async (req, res) => {
      const query = { email: req.body.email };
      const updatedDoc = {
        $set: req.body
      };
      const option = { upsert: true };
      const result = await userCollection.updateOne(query, updatedDoc, option);
      res.send(result);
    });

    //task related
    app.get('/tasks', async (req, res) => {
      result = await taskCollection.find({ addedBy: req.query.email }).sort({ _id: -1 }).toArray();
      res.send(result);
    })

    app.post('/tasks', async (req, res) => {
      result = await taskCollection.insertOne(req.body);
      sendTasks(req.body.addedBy);
    });

    //   socket.on('getTasks', async (email) => {
    //     result = await taskCollection.find({ addedBy: email }).sort({ _id: -1 }).toArray();
    //     socket.emit('tasks', result);
    //   })

    //   socket.on('deleteTask', async (id) => {
    //     const query = { _id: new ObjectId(id) }
    //     const result = await taskCollection.deleteOne(query);
    //     if (result.deletedCount) {
    //       socket.emit('taskDeleted');
    //     }
    //   })

    //   socket.on('modified', async (data) => {
    //     const result = await activityCollection.insertOne(data);
    //   })

    //   socket.on("movedCategory", async (data) => {
    //     const updatedDoc = {
    //       $set: {
    //         category: data.to
    //       }
    //     }
    //     const result = await taskCollection.updateOne({ _id: new ObjectId(data.id) }, updatedDoc);
    //     if (result.modifiedCount) {
    //       socket.emit('categoryModified');
    //     }
    //   })

    //   socket.on('update', async (data) => {
    //     console.log(data);
    //     const { oldId, ...other } = data;
    //     const updatedDoc = {
    //       $set: {
    //         title: other.title,
    //         description: other.description,
    //         category: other.category,
    //         deadline: other.deadline
    //       }
    //     }
    //     const result = await taskCollection.updateOne({ _id: new ObjectId(oldId) }, updatedDoc);
    //     if (result.modifiedCount) {
    //       socket.emit('updated');
    //     }
    //   })

    //   socket.on('getActivities', async (email) => {
    //     const result = await activityCollection.find({ user: email }).sort({ _id: -1 }).toArray();
    //     socket.emit('activities', result);
    //   })
    //   socket.on('disconnect', () => {
    //     console.log('User disconnected');
    //   });
    // })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

server.listen(port, () => console.log("Server running on port:", port));
