import connectDb from './mongo'
import express from 'express'
import cors from 'cors'
import listener, { stream } from './listener'
import mongoose from 'mongoose'

const port = process.env.DATABASE_PORT || 4000;

const app = express();
app.use(cors())

const server = require('http').createServer(app);
export const io = require('socket.io')(server,{ origins: '*:*'});

io.on('connection', function (socket) {
  console.log('User connected')
  socket.emit('bus1', 'Howdy' )
  socket.on("disconnect", () => console.log("User disconnected"));
})


connectDb()
.then(() =>
server.listen(port, () => {
  console.log('Express connected to MongoDB on port ' + port + ' at ' + new Date());
})
)
.catch(err => console.error(err))

// Clear old data from the DB
// bus1.collection.drop()

listener('bus1')
// listener('bus2')
// listener('bus3')

// Endpoint to check saved results - REST API
app.get(`/db/:vehicleName`, (req, res) => {
  mongoose.model(req.params.vehicleName)
  .find()
  .then(docs => res.send(docs))
  .catch(err => console.error(err))
})
