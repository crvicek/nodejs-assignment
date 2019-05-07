
/*

In this file you will find how we send raw data to other services via nats
There are 2 question points for you to tell us the answer on your presentation
If you're up for it

*/
const csvParse = require("csv-parse")
const fs = require("fs")
const Writable = require("stream").Writable

// NATS Server is a simple, high performance open source messaging system
// for cloud native applications, IoT messaging, and microservices architectures.
// https://nats.io/
// It acts as our pub-sub (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
// mechanism for other service that needs raw data
const NATS = require("nats")

// At this point, do not forget to run NATS server!

// NATS connection happens here
// After a connection is made you can start broadcasting messages (take a look at nats.publish())
const nats = NATS.connect({ json: true })

// This function will start reading out csv data from file and publish it on nats
const readOutLoud = (vehicleName, connectionSpeed) => {
	// Read out meta/route.csv and turn it into readable stream
	const fileStream = fs.createReadStream("./meta/route.csv")
	// =========================
	// Question Point 1:
	// What's the difference betweeen fs.createReadStream, fs.readFileSync, and fs.readFileAsync?
	// And when to use one or the others
	// =========================
	// fs.createReadStream: reads the file in chunks of 16KB and sends them one by one, /fast performance no matter of the file size
	// fs.readFileAsync: reads/buffers the whole file and only then starts callback (send), thus it is non blocking - runs in the back / ok for small files up to 10MB
	// fs.readFileSync: same as readFile but blocks the code
	// =========================

	// Now comes the interesting part,
	// Handling this filestream requires us to create pipeline that will transform the raw string
	// to object and sent out to nats
	// The pipeline should looks like this
	//
	//  File -> parse each line to object -> published to nats
	//

	let i = 0

	return (fileStream
		// Filestream piped to csvParse which accept nodejs readablestreams and parses each line to a JSON object
		.pipe(csvParse({ delimiter: ",", columns: true, cast: true }))
		// Then it is piped to a writable streams that will push it into nats
		.pipe(new Writable({
			objectMode: true,
			write(obj, enc, cb) {
				// setTimeout in this case is there to emulate real life situation
				// data that came out of the vehicle came in with irregular interval
				// Hence the Math.random() on the second parameter
				setTimeout(() => {
					i++

					if ((i % 100) === 0)
						console.log(`${vehicleName} have sent ${i} messages.`)
					// The first parameter on this function is topics in which data will be broadcasted
					// it also includes the vehicle name to seggregate data between different vehicle
					nats.publish(`vehicle.${vehicleName}`, obj, cb)

				}, Math.ceil(Math.random() * connectionSpeed))
			}
		})))
	// =========================
	// Question Point 2:
	// What would happend if it failed to publish to nats or connection to nats is slow?
	// Maybe you can try to emulate those slow connection
	// =========================
}

// sleep is a break function at the end of the route
const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// This next few lines simulate Henk's (our favorite driver) shift
const simulator = (delay, speed, busName, driver) => {

	setTimeout(() => {
		console.log(`${driver} checks in on ${busName} starting his shift...`)
		const read = () =>
			readOutLoud(busName, speed)
				.once("finish", async () => {
					console.log(`${driver} is on the last stop and he is taking a cigarrete while waiting for his next trip`)
					
					// To make your presentation interesting maybe you can make henk drive again in reverse
					// Although the route is probably not circular, driver starts again from the start after the break
					await sleep(10000)
					console.log(`${driver} is starting another round.`)
					read()
				})
		read()
	}
		, delay)
}

simulator(0, 200, 'bus1', 'Henk')
simulator(8 * 1000, 300, 'bus2', 'Kees')
simulator(15 * 1000, 50, 'bus3', 'Sjonnie')
