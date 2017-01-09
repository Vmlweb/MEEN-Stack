//Modules
import * as async from 'async'

//Includes
import { Method, Endpoint } from 'app'
import { User } from 'models'

const execute = (req, res, next) => {
	
	//Check required parameters
	let userId = req.body.userId || ''
	let username = req.body.username || ''
	let email = req.body.email || ''
	
	//Validate parameter fields
	if (userId.length <= 0){ return next('User identifier must be given') } 
	if (username.length <= 0){ return next('Username must be given') }
	if (email.length <= 0){ return next('E-mail address must be given') }
	
	//Start async operations	
	async.waterfall([
		(done) => {
			
			//Find user in database
			User.findById(userId, (err, user) => {
				if (user){
					done(null, user)
				}else{
					done(err)
				}
			})
			
		}, (user, done) => {
			
			//Update user details
			user.username = username
			user.email = email
			
			//Save changes to database
			user.save((err) => {
				if (err){
					done(err)
				}else{
					done(null)
				}
			})
			
		}
	], (err) => {
		if (err){
			next(err)
		}else{
			res.json({})
		}
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/users/:userId',
	method: Method.Delete,
	execute: execute,
	
	//! Documentation
	title: 'Update User',
	description: 'Update a specific users details.',
	errors: {},
	
	//! Layouts
	parameters: {
		request: {
			userId: 'Identifier of the user to update',
			username: 'New username to apply to user',
			email: 'New email address to apply to user'
		}
	},
	example: {
		request: {
			userId: '607f1f77bcf86cd799439013',
			username: 'NewUsername',
			email: 'NewEmail@NewEmail.com'
		}
	}
})