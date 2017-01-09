//Includes
import { Time, Method, Endpoint } from 'app'

const execute = (req, res, next) => {
	
	//Create time object
	let time = new Time(req.query.format || null)
	
	//Return json as respose
	res.json({
		time: time.getTime()
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/time',
	method: Method.Get,
	execute: execute,
	
	//! Documentation
	title: 'Time',
	description: 'Get the formatted current time.',
	errors: {},
	
	//! Layouts
	parameters: {
		request: {
			format: 'Moment time format, defaults to dddd, MMMM Do YYYY, h:mm:ss a.'
		},
		response: {
			time: 'Time using format dddd, MMMM Do YYYY, h:mm:ss a.'
		}
	},
	example: {
		request: '?format=dddd, MMMM Do YYYY, h:mm:ss a.',
		response: {
			time: 'Sunday, December 12th 2012, 12:12:12 am'
		}
	}
})