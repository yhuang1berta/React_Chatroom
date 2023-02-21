/* mongo-update-student */
// Vanilla methods to update a student on a mongo database (no Mongoose).

'use strict'
const log = console.log

const {MongoClient, ObjectID} = require('mongodb')

// Updating Student Documents
MongoClient.connect('mongodb://localhost:27017/StudentAPI', 
  { useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {

	if (error) {
		log("Can't connect to Mongo server")
		return
	}
	log('Connected to mongo server')

	const db = client.db('StudentAPI')

	db.collection('Students').findOneAndUpdate({
		_id: new ObjectID('5bf0f87c47dc1d4dc4c3f04d')  // replace with object id of a real student in the db.
	}, {
		// update operators: $set and $inc
		$set: { 
			name: 'Kelly',  // set the name to be 'Kelly'
		}, 
		$inc: {
			year: 1  // increment year by 1
		}
	}, {
		returnOriginal: false // gives us back updated arguemnt
	}).then((result) => {
		log(result)
	});

	// Close the connection
	client.close();
})

