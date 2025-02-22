require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, { cors: { origin:[ "http://localhost:5173", "https://task-flow-c8b5e.web.app/"] } });

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

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on('addTask', async(task) => {
        result = await taskCollection.insertOne(task);
        if(result.insertedId){
          socket.emit('taskAdded', 'Task Added')
        }
      });

      socket.on('getTasks', async(email) => {
        result = await taskCollection.find({addedBy: email}).toArray();
        socket.emit('tasks', result);
      })

      socket.on('deleteTask', async(id) => {
        const query = { _id: new ObjectId(id) }
        const result = await taskCollection.deleteOne(query);
        if(result.deletedCount){
          socket.emit('taskDeleted');
        }
      })

      socket.on('modified', async(data) => {
        const result = await activityCollection.insertOne(data);
      })

      socket.on('getActivities', async(email) => {
        const result = await activityCollection.find({user: email}).sort({_id: -1}).toArray();
        socket.emit('activities', result);
      })
    })

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
