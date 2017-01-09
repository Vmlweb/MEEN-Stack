//Includes
import { Method, Endpoint } from 'app'
import { User } from 'models'

const execute = (req, res, next) => {
	
	//Check required parameters
	let userId: string = req.params.userId || ''
	
	//Validate parameter fields
	if (userId.length <= 0){ return next('User identifier must be given') } 
	
	//Find user in database
	User.findById(userId, (err, user) => {
		user.remove((err) => {
			if (err){
				next(err)
			}else{
				res.json({})
			}
		})
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/users/:userId',
	method: Method.Delete,
	execute: execute,
	
	//! Documentation
	title: 'Delete User',
	description: 'Deletes a specific user from the database.',
	errors: {},
	
	//! Layouts
	parameters: {
		request: {
			userId: 'Identifier of user to remove'
		}
	},
	example: {
		request: '/607f1f77bcf86cd799439014'
	}
})