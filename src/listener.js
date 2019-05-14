import mongoose from 'mongoose';
import routeSchema from './models/route'
import { io } from './index'

const NATS = require("nats")
const nats = NATS.connect({ json: true })

// Dynamically create model/collection based on
// route schema and vehicle name, start listening to selected vehicle,
// emit live data
// and save the messages to the database

const listener = (vehicleName) => {
  const Route = mongoose.model(vehicleName, routeSchema)

  nats.subscribe('vehicle.' + vehicleName, function (msg) {
    console.log('Received a message: ' + Object.values(msg))

    io.emit(vehicleName, msg)
    return new Route(msg).save()
  })
}

export default listener