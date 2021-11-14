const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//database connection here
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpwhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("secoricos_security");
        const allProductsCollection = database.collection("allProducts");
        const reviewCollection = database.collection("review");
        const usersCollection = database.collection("users");

        // get api
        app.get('/allProducts', async (req, res) => {
            const cursor = allProductsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        //GET SINGLE allProducts API
        app.get('/allProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allProductsCollection.findOne(query);
            res.json(result)
        });

        //post api
        app.post('/allProducts', async (req, res) => {
            const allProduct = req.body;
            const result = await allProductsCollection.insertOne(allProduct);
            res.json(result)
        });

        //UPload Review Data Method 
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });

        //put api make a admin
        app.put('users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        //delete api
        app.delete('/allProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allProductsCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('secoricos security server is running');
});
app.listen(port, () => {
    console.log('running listen port', port);
});