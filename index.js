const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqdjl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const activitiesCollection = client.db('helpingHands').collection('activities');

    app.get('/activities', async (req, res) => {
      const query = {};
      const cursor = activitiesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post('/add-activities', async (req, res) => {
      const activities = req.body;
      const result = await activitiesCollection.insertOne(activities);
      res.send({ success: 'Activities added successfully.' })
    })

  }
  finally {
    //  await client.close()
  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log(`Server is runnig from port ${port}`);
})