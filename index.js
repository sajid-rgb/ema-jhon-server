const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
console.log(process.env.DB_PASS);
app.use(cors())
app.use(bodyParser.json())
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.weqbi.mongodb.net/emajhonstore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emajhonstore").collection("products");
  const orders = client.db("emajhonstore").collection("orders");
  app.post('/addProducts',(req,res)=>{
      const product = req.body;
      products.insertMany(product)
      .then(result=>{
          console.log(result)
          res.send(result.insertedCount)
      })
  })
     app.get('/products',(req,res)=>{
         products.find({})
         .toArray((err,documents)=>{
             res.send(documents)
         })
     })
     app.get('/product/:key',(req,res)=>{
         console.log(req.params.key);
        products.find({key:req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })
    app.post('/addProductsByKeys',(req,res)=>{
        const productKeys=req.body
        console.log(req.body);
        products.find({key:{$in:productKeys}})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.post('/addOrders',(req,res)=>{
        const order = req.body;
        orders.insertOne(order)
        .then(result=>{
            console.log(result)
            res.send(result.insertedCount>0)
        })
    })
});
app.listen(3001)