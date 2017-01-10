//Includes
import { Method, Endpoint, log } from 'app'
import { User } from 'models'

const execute = (req, res, next) => {
	
	//Check required parameters
	let username: string = req.body.username || ''
	let email: string = req.body.email || ''
	
	//Validate parameter fields
	if (username.length <= 0){ return next('Username must be given') }
	if (email.length <= 0){ return next('E-mail address must be given') }
	
	//Update user details
	let user = new User({
		username: username,
		email: email
	})
	
	//Save changes to database
	user.save((err) => {
		if (err){
			next(err)
		}else{
			log.info('User ' +  + ' created')
			res.json({
				userId: user.id.toString()
			})
		}
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/users',
	method: Method.Post,
	execute: execute,
	
	//! Documentation
	title: 'Insert User',
	description: 'Insert a new user into the database.',
	errors: {},
	
	//! Layouts
	parameters: {
		request: {
			username: 'Username for the user to add',
			email: 'E-mail address for the user to add'
		},
		response: {
			userId: 'Identifier of the user'
		}
	},
	example: {
		request: {
			username: 'MyUsername',
			email: 'MyEmail@MyEmail.com'
		},
		response: {
			userId: '607f1f77bcf86cd799439014'
		}
	}
})