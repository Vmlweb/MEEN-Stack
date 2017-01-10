//Includes
import { Method, Endpoint, log } from 'app'
import { User } from 'models'

const execute = (req, res, next) => {
	
	//Check required parameters
	let userId: string = req.params.userId || ''
	
	//Validate parameter fields
	if (userId.length <= 0){ return next('User identifier must be given') } 
	
	//Find user in database and remove
	User.findByIdAndRemove(userId, (err, user) => {
		if (err){
			next(err)
		}else{
			log.info('User ' + user.id.toString() + ' removed')
			res.json({
				userId: user.id.toString()
			})
		}
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
		},
		response: {
			userId: 'Identifier of the user'
		}
	},
	example: {
		request: '/607f1f77bcf86cd799439014',
		response: {
			userId: '607f1f77bcf86cd799439014'
		}
	}
})