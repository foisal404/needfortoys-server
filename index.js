const express = require('express');
const cors = require('cors');
const app=express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port=process.env.PORT || 5000;

//middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.pxrxjz6.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("toysDB");
    const categoriesCollection = database.collection("categories");
    const toysCollection = database.collection("toys");
    app.get('/categories',async(req,res)=>{
        const result = await categoriesCollection.find().toArray();
        res.send(result)
    })
    app.get('/toys',async(req,res)=>{
      const result =await toysCollection.find().toArray();
      res.send(result)
    })

    // specific one toy using id
    app.get('/toys/:id',async(req,res)=>{
      const id=req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      // console.log(result)
      res.send(result)
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


app.get('/',(req,res)=>{
    res.send("Toy server running ...")
})

app.listen(port,()=>{
    console.log(`Toy server running on port ${port}`)
})