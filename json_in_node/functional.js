// Some Functional JS
const log = console.log

students = [
	{name: 'Bob', year: 3},
	{name: 'Kelly', year: 2},
	{name: 'Randy', year: 3},
	{name: 'Jimmy', year: 1},
	{name: 'Betty', year: 4},
	{name: 'Clara', year: 3}
]

// How can we make an array of all 3rd year students?
const thirdYears = []
for (let i = 0; i < students.length; i++) {
	if (students[i].year === 3) {
		thirdYears.push(students[i])
	}
}
log(thirdYears)

// The for loop is a lot of code
// We can take advantage of JavaScript's first-class functions
// to write this in a uch easier way

/// functional array methods
// filter
// filter takes a callback function and an argument
// that is assigned to each element of the array
// it adds to a new array any element that passes a test
//     (returns true)

// const isThirdYear = function(student) {
// 	return student.year === 3
// }

const thirdYearsFunctional = students.filter(function(student) {
	return student.year === 3
})

log(thirdYearsFunctional)

// How can we make an array of all student names?
const studentNames = []
for (let i = 0; i < students.length; i++) {
	studentNames.push(students[i].name)
}
log(studentNames)

// map
const studentNamesFunctional = students.map(function (student) {
	return student.name
})

log(studentNamesFunctional)

// Now let's use the arrow functions with filter and map
const thirdYearsArrow = students.filter((student) => student.year === 3)
log(thirdYearsArrow)

// MUCH less code than the for loop and more readable

// map with arrow
const studentNamesArrow = students.map((student) => student.name)
log(studentNamesArrow)

////
// More generic functional array method: reduce()
// filter and map are specific, and reduce can implement
// both of them

const accounts = [
	{ balance: 5 },
	{ balance: 10 },
	{ balance: -3 },
]

// how do we sum up all of the balances?

// reduce takes a function and an optional argument
// that can be changed and then re-fed into the function
// after iterating over a value in the array
const totalBalance = accounts.reduce(function(total, account)  {
	log(total)
	return total + account.balance 
	// the return value is assigned to total for the next account
}, 0)

log(totalBalance)

const totalBalanceArrow = accounts.reduce((total, account) => total + account.balance, 0)
log(totalBalanceArrow)















