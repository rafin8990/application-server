const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






async function run() {
    try {
        const applicationCollection = client.db('applicationWebsite').collection('application');

        // application post 
        app.post('/application', async(req, res)=>{
            const data = req.body;
            const result= await applicationCollection.insertOne(data);
            res.send(result);
        });

        // application get 

        app.get('/application', async(req, res)=>{
            const query={};
            const result= await applicationCollection.find(query).toArray();
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Application server is running')
});

app.listen(port, () => {
    console.log(`Application server is running on port ${port}`)
});