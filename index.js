const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs = require('fs')
const uploader = require('./uploader');

const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/', express.static('postImages'));



// MongoDB URL 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nuouh7o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {

        const applicationCollection = client.db('applicationWebsite').collection('application');

        // application post 
        app.post('/application', uploader.array('files'), async (req, res) => {
            const files = req.files.map((file) => {
                return {
                    filename: file.filename,
                    path: file.path,

                };
            });
            const name = req.body.name;
            const mobile = req.body.mobile;
            const application = req.body.application;
            const time=req.body.time;
            const docs = { files, name, mobile, application, time };
            const result = await applicationCollection.insertOne(docs);
            res.send(result)

        });



        // application get 

        app.get('/application', async (req, res) => {
            const query = {};
            const result = await applicationCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/search', async (req, res) => {
            const mobile = req.query.mobile;
            const query = { mobile: mobile };
            const result = await applicationCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/updateData/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await applicationCollection.findOne(query);
            res.send(result)
        })

        app.put('/update/:id', uploader.array('picture'), async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const picture = req.picture.map((file) => {
                return {
                    filename: file.filename,
                    path: file.path,

                };
            });
            const updatedDoc = {
                $set: {
                    picture: picture
                }
            }
            const result = await applicationCollection.updateOne(filter, updatedDoc, option);
            res.send(result);
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