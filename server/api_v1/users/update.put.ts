//Modules
import * as async from 'async'

//Models
import { User } from 'models'

export default (req, res, next) => {
	
	//Check for all required parameters
	let userId = req.body.userId || null
	let username = req.body.username || null
	let email = req.body.email || null
	
	//Validate parameter fields
	if (userId === '' || userId === null){ return next('User identifier must be given') } 
	if (username === '' || username === null){ return next('Username must be given') }
	if (email === '' || email === null){ return next('E-mail address must be given') }
	
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