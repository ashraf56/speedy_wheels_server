const express = require('express')
const app = express()
const port = process.env.PORT|| 3000
let cors=require("cors")

require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');




const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
  app.use(cors(corsConfig))
  app.options("", cors(corsConfig))


app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5nj1o0g.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    let toyCollection=client.db('ToysDB').collection('Alltoy')

app.post('/alltoy',async (req,res)=>{
let toys=req.body;
let result= await toyCollection.insertOne(toys)
res.send(result)
})

app.get('/alltoy' , async(req,res)=>{
  const limit = parseInt(req.query.limit) || 20;
let result= await  toyCollection.find().limit(limit).toArray();
res.send(result)
})

app.put('/alltoy/:id',async(req,res)=>{
let toybody=req.body;
   let tid= req.params.id;
   const filter = { _id: new ObjectId(tid)};
     const options = { upsert: true };
const updateDoc = {
    $set: {
      price: toybody.price,
      quantity:toybody.quantity,
      description: toybody.description
    },
    
  };
  const result = await toyCollection.updateOne(filter, updateDoc, options);
        res.send(result)

})
app.get('/alltoy/:id',async(req,res)=>{

   let toyid= req.params.id;
    let query={_id: new ObjectId(toyid)}
        let results= await toyCollection.findOne(query)
        res.send(results)

})



 app.get("/atoy/:text", async (req, res) => {
   
  
  const toyscategory = await toyCollection.find({
          subCategory: req.params.text }).toArray();
   res.send(toyscategory);
 
 
    });


app.delete('/alltoy/:id' ,async (req,res)=>{
  let delid= req.params.id;
  const query = { _id: new ObjectId(delid) };
  const result = await toyCollection.deleteOne(query);
  res.send(result)
  })

app.get('/mytoy',async (req ,res)=>{

let toyquery={}
if (req.query?.email) {
  toyquery={email: req.query.email}
}
let results= await toyCollection.find(toyquery).toArray()
res.send(results)
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