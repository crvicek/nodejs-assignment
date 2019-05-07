import mongoose from 'mongoose';
import routeSchema from './models/route'

const NATS = require("nats")
const nats = NATS.connect({ json: true })

// Dynamically create model/collection based on
// route schema and vehicle name, start listening to selected vehicle
// and save the messages to the database

const listener = (vehicleName) => {

  const Route = mongoose.model(vehicleName, routeSchema)

  nats.subscribe('vehicle.' + vehicleName, function (msg) {
    console.log('Received a message: ' + Object.values(msg))
    return new Route(msg).save()
  })
}

export default listener;


