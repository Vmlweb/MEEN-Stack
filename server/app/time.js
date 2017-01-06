//Modules
import moment from 'moment';

export class Time{

	//Init with default time format	
	constructor(format){
		this.format = format || 'ddd, hA'
	}

	//Return time using time format	
	getTime(){
		return moment().format(this.format);
	}
}