//Module
import { Ember } from 'vendor'

export const App = Ember.Controller.extend({
	init(){
		
		//Check new time every .2 seconds
		setInterval(() => {
			$.ajax({
				url: '/api/v1/time'
			}).done((response) => {
				this.set('time', response.time)
			})
		}, 200)
	}	
})