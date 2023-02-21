/* Node Command Line Arguments */ 
'use strict';
const log = console.log
log('Node command line');

const course = require('./course')
const courseList = ['csc309', 'csc343']

/* User input */
// passing in command line arguments

/// with argv directly off of the node process
//log(process.argv)
// const command = process.argv[2]
// const courseName = process.argv[3]

// with YARGS module from npm
const yargs = require('yargs')
const yargv = yargs.argv
log(yargv)


/// commented out parts are without using YARGS.
//if (command === '--add') {
if('add' in yargv) {
	// course.addCourse(courseList, courseName)
	course.addCourse(courseList, yargv.add)
	log(courseList)
}

//if (command === '--remove') {
if('remove' in yargv) {	
	/// course.removeCourse(courseList, courseName)
	course.removeCourse(courseList, yargv.remove)
	log(courseList)
}

/// Example run: 
// $ node app.js --add csc108 --remove csc343


