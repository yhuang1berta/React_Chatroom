/* Course selection module */
console.log('Course selection module')

module.exports = {
	addCourse: function(courseList, course) {
		courseList.push(course)
	},

	removeCourse: function(courseList, course) {
		const i = courseList.indexOf(course)
		courseList.splice(i, 1)
	}
}

