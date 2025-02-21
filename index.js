require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173/" } });

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
