const express = require('express');
const cors = require('cors');
const Twilio = require('twilio')('AC04ef20ee62a7067c0bd01bc5221f3a7f', 'b6b24285e2154635c241eef6f620548a');
const { MessagingResponse } = require('twilio').twiml;
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
        app.post('/application', async (req, res) => {
            const data = req.body;
            const result = await applicationCollection.insertOne(data);
            Twilio.messages
                .create({ body: "Hello from Twilio", from: "+14632523158", to: `${req.body.mobile}` })
                .then(message => console.log(message.sid));
            res.send(result);
        });

        app.post('/sms', (req, res) => {
            const twiml = new MessagingResponse();
          
            twiml.message('The Robots are coming! Head for the hills!');
          
            res.type('text/xml').send(twiml.toString());
          });
          

        // application get 

        app.get('/application', async (req, res) => {
            const query = {};
            const result = await applicationCollection.find(query).toArray();
            res.send(result)
        });


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