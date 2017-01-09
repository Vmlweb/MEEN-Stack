//Models
import { User } from 'models'

//Endpoint
export const url = '/users'
export const method = 'GET'

//Method
export default (req, res, next) => {
	
	//Check for all required parameters
	let limit = req.query.limit ? parseInt(req.query.limit) : -1
	
	//Validate parameter fields
	if (limit < 0){ return next('Limit must be an integer') } 
	
	//Find all users in the database
	User.find().sort({'_id': 1}).limit(limit).exec((err, users) => {
		if (err){
			return next(err)
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