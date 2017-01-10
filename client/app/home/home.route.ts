//Modules
import { Ember } from 'vendor'

export const AppHome = Ember.Route.extend({
	
	willTransition(){
		console.log('test')
	},
	
	model() {
		return {
			time: 'Loading...',
			users: this.get('store').findAll('user'),
			create: {
				username: '',
				email: ''
			}
		}
	}
})