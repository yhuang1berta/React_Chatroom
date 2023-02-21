/* mongo-delete-student */
// Vanilla methods to delete a student on a mongo database (no Mongoose).

'use strict'
const log = console.log

const { MongoClient } = require('mongodb')

// Deleting Student documents
MongoClient.connect('mongodb://localhost:27017/StudentAPI', 
  { useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {

	if (error) {
		log("Can't connect to Mongo server")
		return
	}
	log('Connected to mongo server')

	const db = client.db('StudentAPI')

	// deleteMany: deletes all documents with certain condition
	db.collection('Students').deleteMany({year: 2}).then((result) => {
		log(result.value)
	})

	// deleteOne: deletes first document with certain condition
	db.collection('Students').deleteOne({year: 2}).then((result) => {
		log(result.value)
	})

	// findOneAndDelete: deletes and returns the deleted object
	db.collection('Students').findOneAndDelete({year: 3}).then((result) => {
		log(result.value)
	})

	// Close the connection
	client.close();
})







