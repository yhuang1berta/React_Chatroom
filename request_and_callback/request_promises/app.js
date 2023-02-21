/* Bike location app, now using promises. */
'use strict';
const log = console.log
log('request in node (with promises)')

const request = require('request');

const bikes = require('./bike-location-promise')
const address = require('./address-promise')


bikes.stationInformation(7001).then((result) => {
	log(result) // we know that result exists here
	return address.getAddress(result.lat, result.lon) // make the next api call, which returns a promise
}).then((addressResult) => {
	log(`The address for this bike station is ${addressResult.address}`)
}).catch((error) => {
	log(error)  // handle any rejects that come up in the chain.
})
// Much cleaner, no callback hell.
