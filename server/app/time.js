//Modules
import moment from 'moment';

export default class Time{

	//Init with default time format	
	constructor(format){
		this.format = format || 'ddd, hA'
	}

	//Return time using time format	
	getTime(){
		return moment().format(this.format);
	}
}