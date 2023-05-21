const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;

//midddleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brc1eh6.mongodb.net/?retryWrites=true&w=majority`;

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
   // await client.connect();

    //collection create
    const toyCollection = client.db("toymarket").collection("alltoy");
    

    app.get("/alltoys",async (req,res)=>{
      console.log(req.query.email);
      let query={};
      if (req.query?.email) {
        query={email: req.query.email}
      }
      if (req.query?.category) {
        query={...query,category: req.query.category}
      }
      
      const result=await toyCollection.find(query).toArray();
      res.send(result);
    })

    

    

    app.get("/alltoys/:id",async (req,res)=>{
      const id = req.params.id;
            const query = { _id: new ObjectId(id) }
      const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: {_id:1, price: 1, quantity: 1, picurl: 1, detail: 1 },
            };
      
      const result = await toyCollection.findOne(query, options);
            res.send(result);
        })


      //   //updtate
      //   app.patch('/alltoys/:id', async (req, res) => {
      //     const id = req.params.id;
      //     const filter = { _id: new ObjectId(id) };
      //     const updatedtoy = req.body;
      //     console.log(updatedtoy);
      //     const updateDoc = {
      //         $set: {
      //             name:updatedtoy.name,
      //             quantity:updatedtoy.quantity,
      //             detail: updatedtoy.detail
      //         },
      //     };
      //     const result = await toyCollection.updateOne(filter, updateDoc);
      //     res.send(result);
      // })


app.delete('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })



    app.post("/addtoys",async(req,res)=>{
    const user=req.body;
    console.log(user);
   
    const result=await toyCollection.insertOne(user);
    console.log(result);
    res.send(result);
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
    res.send('server run')
})

app.listen(port,()=>{
    console.log(`runserver port ${port}`);
})