/* dom content loaded */
"use strict";
const log = console.log
log('Loading DOM Content')

function logId(element) {
	log(element.id)
}

/// Suppose we don't use 'defer' in the HTML and put the <script> tag inside of <head>.
// The DOM isn't loaded yet, so we can't find myElement:
// const myElement = document.querySelector('#myId')
// logId(myElement)

// Instead, we can listen to the DOMContentLoaded event.
document.addEventListener('DOMContentLoaded', function() {
	const myElement = document.querySelector('#myId')
	logId(myElement)

	/// How can we take a function from within this scope to the global scope?

	// won't be able to see logId2 outside of this scope...
	const logId2 = function(element) {
		log(element.id)
	}

	// ..but can attach to global window object
	window.logId3 = function(element) {
		log(element.id)
	}

})


