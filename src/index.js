import connectDb from './mongo'
import express from 'express'
import cors from 'cors';
import Route from './models/route';

const port = process.env.DATABASE_PORT || 4000;

const app = express();
app.use(cors())

connectDb()
  .then(() =>
    app.listen(port, () => {
      console.log('Express connected to MongoDB on port ' + port + ' at ' + new Date());
    })
  )
  .catch(err => console.error(err))

// Clear old data from the DB
// Route.collection.drop()

// Endpoint to check saved results
app.get('/', (req, res) => {
  Route
    .find()
    .then(docs => res.send(docs))
    .catch(err => console.error(err))
})


// Listen to NATS and save the messages
const NATS = require("nats")
const nats = NATS.connect({ json: true })

nats.subscribe('vehicle.test-bus-1', function (msg) {
  console.log('Received a message: ' + Object.values(msg))
  saveRide(msg)
})

const saveRide = async (data) => {
  const ride = new Route(data)
  return await ride.save()
}