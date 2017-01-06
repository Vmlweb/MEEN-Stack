//Modules
import async from 'async'

//Models
import User from 'models'

export default (req, res, next) => {
	
	//Parse body
	let username = req.body.username || null
	let email = req.body.email || null
	
	//Validate parameter fields
	if (username === '' || username === null){ return next('Username must be given') }
	if (email === '' || email === null){ return next('E-mail address must be given') }
	
	//Start async operations
	async.waterfall([
		(done) => {
			
			//Update user details
			let user = new User()
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