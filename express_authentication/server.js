/* server.js - user & resource authentication */
'use strict';
const log = console.log
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require('./db/mongoose')
mongoose.set('bufferCommands', false);  // don't buffer db requests if the db server isn't connected - minimizes http requests hanging if this is the case.
mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { Student } = require('./models/student')
const { User } = require('./models/user')

// to validate object IDs
const { ObjectID } = require('mongodb')

/// handlebars server-side templating engine
const hbs = require('hbs')
// Set express property 'view engine' to be 'hbs'
app.set('view engine', 'hbs')
// setting up partials directory
hbs.registerPartials(path.join(__dirname, '/views/partials'))

/*** Helper functions below **********************************/
function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser') 
app.use(bodyParser.json())

// express-session for managing user sessions
const session = require('express-session')
app.use(bodyParser.urlencoded({ extended: true }));

// Our own express middleware to check for 
// an active user on the session cookie (indicating a logged in user.)
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/dashboard'); // redirect to dashboard if logged in.
    } else {
        next(); // next() moves on to the route.
    }    
};

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} else {
		next()	
	}	
}

/*** Session handling **************************************/
// Create a session cookie
app.use(session({
    secret: 'oursecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000,
        httpOnly: true
    }
}));

// A route to login and create a session
app.post('/users/login', mongoChecker, (req, res) => {
	const email = req.body.email
    const password = req.body.password

    // Use the static method on the User model to find a user
    // by their email and password
	User.findByEmailPassword(email, password).then((user) => {
	    if (!user) {
            res.redirect('/login');
        } else {
            // Add the user's id to the session cookie.
            // We can check later if this exists to ensure we are logged in.
            req.session.user = user._id;
            req.session.email = user.email
            res.redirect('/dashboard');
        }
    }).catch((error) => {
    	// redirect to login if can't login for any reason
    	if (isMongoError(error)) { 
			res.status(500).redirect('/login');
		} else {
			log(error)
			res.status(400).redirect('/login');
		}
		
    })
})

// A route to logout a user
app.get('/users/logout', (req, res) => {
	// Remove the session
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

/*** User routes below ****************/
// Set up a POST route to create a user of your web app (*not* a student).
app.post('/users', mongoChecker, (req, res) => {
	log(req.body)

	// Create a new user
	const user = new User({
		email: req.body.email,
		password: req.body.password
	})

	// Save the user
	user.save().then((user) => {
		res.send(user)
	})
	.catch((error) => {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	})
})

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.status(401).send("Unauthorized")
		})
	} else {
		res.status(401).send("Unauthorized")
	}
}


/*** Webpage routes below **********************************/
// Inject the sessionChecker middleware to any routes that require it.
// sessionChecker will run before the route handler and check if we are
// logged in, ensuring that we go to the dashboard if that is the case.

// The various redirects will ensure a proper flow between login and dashboard
// pages so that your users have a proper experience on the front-end.

// route for root: should redirect to login route
app.get('/', sessionChecker, (req, res) => {
	res.redirect('/login')
})

// login route serves the login page
app.get('/login', sessionChecker, (req, res) => {
	//res.sendFile(path.join(__dirname, '/public/login.html'))
	// render the handlebars template for the login page
	res.render('login.hbs');
})

// dashboard route will check if the user is logged in and server
// the dashboard page
app.get('/dashboard', (req, res) => {
	if (req.session.user) {
		//res.sendFile(path.join(__dirname, '/public/dashboard.html'))
		// render the handlebars template with the email of the user
		res.render('dashboard.hbs', {
			email: req.session.email
		})
	} else {
		res.redirect('/login')
	}
})

// static js directory
app.use("/js", express.static(path.join(__dirname, '/public/js')))

// static image directory
app.use("/img", express.static(path.join(__dirname, '/public/img')))

/*********************************************************/

/*** Student API Routes below ************************************/

/** Student resource routes **/
// a POST route to *create* a student
app.post('/students', mongoChecker, authenticate, (req, res) => {
	// log(req.body)

	// Create a new student using the Student mongoose model
	const student = new Student({
		name: req.body.name,
		year: req.body.year,
		creator: req.user._id // creator id from the authenticate middleware
	})


	// Save student to the database
	student.save().then((result) => {
		res.send(result)
	}).catch((error) => {
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error) // log server error to the console, not to the client.
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	})
})

// a GET route to get all students
app.get('/students', authenticate, (req, res) => {

	Student.find({
		creator: req.user._id // from authenticate middleware
	}).then((students) => {
		// res.send(students) // just the array
		res.send({ students }) // can wrap students in object if want to add more properties
	})
	.catch((error) => {
		log(error)
		res.status(500).send("Internal Server Error")
	})
})

/// a GET route to get a student by their id.
// id is treated as a wildcard parameter, which is why there is a colon : beside it.
// (in this case, the database id, but you can make your own id system for your project if you want)
app.get('/students/:id', mongoChecker, authenticate, (req, res) => {
	/// req.params has the wildcard parameters in the url, in this case, id.
	// log(req.params.id)
	const id = req.params.id

	// Good practise: Validate id immediately.
	if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
	}

	// If id valid, findById
	Student.findOne({_id: id, creator: req.user._id}).then((student) => {
		if (!student) {
			res.status(404).send('Resource not found')  // could not find this student
		} else {
			/// sometimes we wrap returned object in another object:
			//res.send({student})   
			res.send(student)
		}
	})
	.catch((error) => {
		log(error)
		res.status(500).send('Internal Server Error')  // server error
	})

})

/// a DELETE route to remove a student by their id.
app.delete('/students/:id', mongoChecker, authenticate, (req, res) => {
	const id = req.params.id

	// Validate id
	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;
	}

	// Delete a student by their id
	Student.findOneAndDelete({_id: id, creator: req.user._id}).then((student) => {
		if (!student) {
			res.status(404).send()
		} else {   
			res.send(student)
		}
	})
	.catch((error) => {
		log(error)
		res.status(500).send() // server error, could not delete.
	})
})

/* Updating resources - two methods: PUT and PATCH */

// a PUT route for replacing an *entire* resource.
//  The body should contain *all* of the required fields of the resource.
//  This might be less desirable because the client will have to do a GET to find the original
//   values of all of the other fields beyond the ones they want to update.
app.put('/students/:id', mongoChecker, authenticate, (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send('Resource not found')
		return;  // so that we don't run the rest of the handler.
	}

	// add the creator to the request body, since we must replace the entire document.
	req.body.creator = req.user._id

	// Replace the student by their id using req.body
	Student.findOneAndReplace({_id: id, creator: req.user._id}, req.body, {new: true, useFindAndModify: false})
	.then((student) => {
		if (!student) {
			res.status(404).send()
		} else {   
			res.send(student)
		}
	})
	.catch((error) => {
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	})
})

/// a PATCH route for making *specific* changes to a resource.
// The body will be an array that consists of a list of changes to make to the
//  resoure:
/*
[
  { "op": "replace", "path": "/year", "value": 4 },
  { "op": "replace", "path": "/name", "value": "Jim" },
  ...
]
*/
// Based on standard specifcation: https://tools.ietf.org/html/rfc6902#section-3
//   - there are other ways to modify resources (adding, removing properties), but here we will
//     just deal with replacements since our schema is fixed.
app.patch('/students/:id', mongoChecker, authenticate, (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;  // so that we don't run the rest of the handler.
	}
	
	// Find the fields to update and their values.
	const fieldsToUpdate = {}
	req.body.map((change) => {
		const propertyToChange = change.path.substr(1) // getting rid of the '/' character
		fieldsToUpdate[propertyToChange] = change.value
	})

	// Update the student by their id.
	Student.findOneAndUpdate({_id: id, creator: req.user._id}, {$set: fieldsToUpdate}, {new: true, useFindAndModify: false}).then((student) => {
		if (!student) {
			res.status(404).send('Resource not found')
		} else {   
			res.send(student)
		}
	}).catch((error) => {
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	})
})


/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 

