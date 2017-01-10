//Modules
import * as async from 'async'

//Includes
import { Method, Endpoint } from 'app'
import { User } from 'models'

const execute = (req, res, next) => {
	
	//Check for all required parameters
	let limit: number = req.query.limit ? parseInt(req.query.limit) : -1
	
	//Construct find users database query
	let query = User.find().sort('username')
	if (limit > 0){ query.limit(limit) }
	
	//Execute query and return users
	query.exec((err, users) => {
		if (err){
			next(err)
		}else{
		
			//Compile list of response users
			let mappedUsers = users.map((user) => {
				return {
					userId: user.id.toString(),
					username: user.username,
					email: user.email
				}
			})
		
			//Send user array response
			res.json({ users: mappedUsers })
		}
	})
}

export default new Endpoint({
	
	//! Endpoint
	url: '/users',
	method: Method.Get,
	execute: execute,
	
	//! Documentation
	title: 'Get Users',
	description: 'Gets a list of users from the database with a limit.',
	errors: {},
	
	//! Layouts
	parameters: {
		request: {
			limit: 'Limit the number of results'
		},
		response: {
			users: {
				userId: 'Identifier of the user',
				username: 'Username of the user',
				email: 'E-mail address of the user'
			}
		}
	},
	example: {
		request: '?limit=5',
		response: {
			user: [
				{ userId: '607f1f77bcf86cd799439011', username: 'FirstUser', email: 'FirstUser@FirstUser.com' },
				{ userId: '607f1f77bcf86cd799439012', username: 'SecondUser', email: 'SecondUser@SecondUser.com' },
				{ userId: '607f1f77bcf86cd799439013', username: 'ThirdUser', email: 'ThirdUser@ThirdUser.com' }
			]
		}
	}
})