'use strict';
const log = console.log

const request = require('request')

const stationInformation = (stationId) => {
	return new Promise((resolve, reject) => {
		request({
			url: 'https://tor.publicbikesystem.net/ube/gbfs/v1/en/station_information',
			json: true
		}, (error, response, body) => {
			if (error) {
				reject("Can't connect to server")
			} else if (response.statusCode !== 200) {
				reject('Issue with getting resource')
			} else {
				const stations = body.data.stations

				const stationFilter = stations.filter(x => x.station_id === stationId.toString())
				
				if (stationFilter.length !== 0) {
					resolve({
						name: stationFilter[0].name,
						lat: stationFilter[0].lat,
						lon: stationFilter[0].lon
					})
				}
			}
		})
	})
}


module.exports = { stationInformation }

