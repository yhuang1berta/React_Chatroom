/* A module that gets information about a bike station in Toronto given a bike station id. */
'use strict';
const log = console.log

const request = require('request')

// We feed a callback function to this function.
const stationInformation = (stationId, callback) => {
	request({
		url: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information',
		json: true
	}, (error, response, body) => {
		// Two possible errors:
		// one that occurs because we couldn't connect properly to a server.
		//   - that is in the 'error' object
		// one that occurs when we can connect, but didn't find the resource
		//   - will have to check the response status code

		if (error) {
			callback("Can't connect to server")
		} else if (response.statusCode !== 200) {
			callback('issue with getting resource')
		} else {
			const stations = body.data.stations
			const stationFilter = stations.filter(s => s.station_id === stationId.toString())

			// first argument to the callback is an error object, which we will leave as
			//  undefined in the case of a correct result.
			callback(undefined, {
				id: stationFilter[0].station_id,
				name: stationFilter[0].name,
				lat: stationFilter[0].lat,
				lon: stationFilter[0].lon
			})

			/// return won't help us provide object to app.js because this callback is put
			///  on the queue and is run after all app.js's blocking code is finished.
			// return({
			// 	id: stationFilter[0].station_id,
			// 	name: stationFilter[0].name,
			// 	lat: stationFilter[0].lat,
			// 	lon: stationFilter[0].lon
			// })
		}
	});
}


module.exports = { stationInformation }
