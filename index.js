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

    //functions to emit socket event
    const sendTasks = async (email) => {
      result = await taskCollection.find({ addedBy: email }).sort({ _id: -1 }).toArray();
      io.emit('tasks', result);
    }

    const sendActivities = async (email) => {
      const result = await activityCollection.find({ user: email }).sort({ _id: -1 }).toArray();
      io.emit('activities', result);
    }

    //user related api
    app.post('/users', async (req, res) => {
      const result = await userCollection.updateOne(req.body);
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

    app.delete('/tasks/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) }
      const result = await taskCollection.deleteOne(query);
      sendTasks(req.query.email);
      sendActivities(req.query.email);
    })

    app.put('/tasks/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) }
      const updatedDoc = {
        $set: req.body
      }
      const result = await taskCollection.updateOne(query, updatedDoc);
      sendTasks(req.query.email);
    })

    //activity related
    app.post('/activities', async (req, res) => {
      result = await activityCollection.insertOne(req.body);
      sendActivities(req.body.user);
    });

    app.get('/activities', async (req, res) => {
      const result = await activityCollection.find({ user: req.query.email }).sort({ _id: -1 }).toArray();
      res.send(result);
    })

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
