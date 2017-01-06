//Models
import User from 'models'

export default (req, res, next) => {
	
	//Check for all required parameters
	let userId = req.query.userId || null
	
	//Validate parameter fields
	if (userId === '' || userId === null){ return next('User identifier must be given') } 
	
	//Find user in database
	User.findById(userId, (err, user) => {
		user.remove((err, user) => {
			if (user){
				res.json({})
			}else{
				return next(err)
			}
		})
	})
}