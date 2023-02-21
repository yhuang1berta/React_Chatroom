/* Bike location app, using callbacks. */
'use strict';
const log = console.log
log('request in node')

// The npm request module to make HTTP requests.
const request = require('request')

// The modules we made to call specific APIs and provide specific functionality.
const bikes = require('./bike-location')
const address = require('./address')

// won't work because request is asynchornous, and result will be undefined.
//const result = bikes.stationInformation(7001)  

bikes.stationInformation(7001, (errorMessage, result) => {
	if (errorMessage) {
		log(errorMessage)
	} else {
		log(result)
		address.getAddress(result.lat, result.lon, (errorMessage, addressResult) => {
			if (errorMessage) {
				log(errorMessage)
			} else {
				log(`The address for this bike station is: ${addressResult.address}`)
				// if we keep calling apis and making callbacks..
				// Callback hell!
				// Not easy to reason about how the callbacks would work or what 
				// order they would be run in depending on the nesting.
				//  we will fix this next time with Promises.
			}
		})
	}
})

