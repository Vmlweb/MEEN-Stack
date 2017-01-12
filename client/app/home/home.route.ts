//Modules
import { Ember } from 'vendor'

export const AppHome = Ember.Route.extend({
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