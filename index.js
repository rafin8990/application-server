const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        app.post('/application', async (req, res) => {
            const data = req.body;
            const result = await applicationCollection.insertOne(data);
          const url=`https://app.campaignlabs.io/apis/OtpSend/?apiKey=oB8uDA4WQmbjRGw&apiSecret=g7whvO9lQa1GIik&mobile=${req.body.mobile}&message=Your%20Application%20was%20Successfully%20Submitted`
            res.send( result);
        });



        // application get 

        app.get('/application', async (req, res) => {
            const query = {};
            const result = await applicationCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/search', async (req, res) => {
            const mobile = req.query.mobile;
            const query = { mobile: mobile };
            const result = await applicationCollection.find(query).toArray();
            console.log(result)
            res.send(result);
        });

        app.get('/updateData/:id', async(req, res)=>{
            const id=req.params.id;
            const query={_id: new ObjectId(id)};
            const result=await applicationCollection.findOne(query);
            res.send(result)
        })

        app.put('/update/:id', async(req, res)=>{
            const id=req.params.id;
            const filter = {_id: new ObjectId(id)};
            const option = { upsert: true };
            const data=req.body
            const updatedDoc={
                $set: {
                    picture:data.picture
                }
            }
            const result=await applicationCollection.updateOne(filter, updatedDoc, option);
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