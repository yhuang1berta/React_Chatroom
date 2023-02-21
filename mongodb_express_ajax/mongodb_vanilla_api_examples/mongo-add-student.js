/* mongo-add-student */
// Vanilla way to add a student to a mongo database (no Mongoose).

"use strict";
const log = console.log

const { MongoClient } = require('mongodb')

// Connect to the local mongo database and add a student.
MongoClient.connect('mongodb://localhost:27017/StudentAPI', 
  { useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
	
	if (error) {
		log("Can't connect to Mongo server")
		return
	}
	log('Connected to mongo server')

	const db = client.db('StudentAPI')

	// Create a collection (if not already in the database) and insert document into it
	db.collection('Students').insertOne({
		//_id: 7,  // can set your own id or use default
		name: 'Jimmy',
		year: 3
	}, (error, result) => {
		if (error) {
			log("Can't insert student", error)
		} else {
			log(result.ops)
			log(result.ops[0]._id.getTimestamp())
		}
		// close connection
		client.close()
	})

})
