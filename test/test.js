process.env.NODE_ENV = 'test'

import mongoose from 'mongoose'
import chai from 'chai'
import chaiHttp from 'chai-http'
import routeSchema from '../src/models/route'
import { server, io } from '../src/index'
import { db } from '../src/mongo'
import ioClient from 'socket.io-client'

chai.use(chaiHttp)

const should = chai.should()

const vehicleName = 'testbus1'
const route = mongoose.model('testbus1', routeSchema)
const url = 'http://localhost:4000'
const options = { transports: ['websocket'], 'force new connection': true }


describe('Sockets', function () {
  before((done) => {
    io.sockets.on('connection', function (socket) {
      socket.on('testChannel', function (msg, callback) {
        callback = callback || function () { }
        socket.emit('testChannel', msg)
        callback(null, 'Done.')
      })
    })
    done()
  })

  it('should send message through test channel', function (done) {
    var client = ioClient.connect(url, options)

    client.once('connect', function () {
      client.once('testChannel', function (message) {
        message.should.equal(vehicleName)
        client.disconnect()
        done()
      })
      client.emit('testChannel', vehicleName)
    })
  })

})

describe('MongoDB & API', () => {
  // Create the collection before the test
  before((done) => {
    new route({}).save()
      .then((err) => done())
  })

  // Clear the collection before each test
  beforeEach((done) => {
    db.collections[vehicleName].deleteOne(
      {}, (err) => {
        if (err) throw err
        done()
      })
  })

  // Drop the collection before each test
  after((done) => {
    db.collections[vehicleName].drop()
      .then((err) => done())
  })


  //  Test the /GET route
  describe('/GET route', () => {
    it('it should GET testbus1 route', (done) => {
      chai.request(server)
        .get(`/db/${vehicleName}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })

  // Test the data saving
  describe('Save ', () => {
    it('it should save some test data', (done) => {
      const testData = {
        time: 1511512585495,
        energy: 85.14600000000002,
        gps: ["52.08940124511719", "5.105764865875244"],
        odo: 5.381999999997788,
        speed: 12,
        soc: 88.00000000000007
      }
      new route(testData).save()
      chai.request(server)
        .get(`/db/${vehicleName}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.length.should.be.eql(1)
          res.body[0].should.be.a('object')
          res.body[0].should.have.property('created_at')
          res.body[0].should.have.property('speed')
          res.body[0].should.have.property('time')
          res.body[0].gps.should.be.a('array')
          done()
        })
    })
  })
})