//Modules
import moment from 'moment'

//Includes
import { Time } from 'app'

export default (req, res, next) => {
	
	//Create new time object, set format and retrieve value
	let time = new Time()
	let currentTime = time.getTime()
	
	//Send time response
	res.json({ time: currentTime })
}