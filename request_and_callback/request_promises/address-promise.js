'use strict';
const log = console.log

const request = require('request')

const getAddress = (lat, lon) => {
	// Wrap the asynchronous request call in a Promise
	return new Promise((resolve, reject) => {
		request({
			url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=YOUR_API_KEY`,
			json: true
		}, (error, response, body) => {
			if (error) {
				reject("Can't connect to server")
			} else if (response.statusCode !== 200) {
				reject('issue with getting resource')
			} else {
				resolve({
					address: body.results[0].formatted_address
				})
			}
		})
	})
}

module.exports = { getAddress }