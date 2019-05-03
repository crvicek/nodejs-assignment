import connectDb from './mongo'
import express from 'express'
import cors from 'cors';

import mongoose from 'mongoose'
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


const createTestRide = async () => {
  const ride = new Route({
    time: 1511436338000,
    energy: 53.2,
    gps: ["52.093448638916016", "5.117378234863281"],
    odo: 88526.413,
    speed: 0,
    soc: 72.8
  })
  await ride.save()
}
createTestRide()

app.get('/', (req, res) => {
  Route
    .find()
    .then(docs => res.send(docs))
    .catch(err => console.error(err))
})

// app.get('/', async (req, res) => {
//   const doc = await Route.find({})
//   return res.send(doc)
// })

