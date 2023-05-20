const express = require('express')
const app = express()
const port = process.env.PORT|| 3000
let cors=require('cors')

require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5nj1o0g.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    let toyCollection=client.db('ToysDB').collection('Alltoy')

app.post('/alltoy',async (req,res)=>{

let toys=req.body;
let result= await toyCollection.insertOne(toys)
res.send(result)
})

app.get('/alltoy' , async(req,res)=>{

let result= await  toyCollection.find().toArray();
res.send(result)
})


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('toy World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})