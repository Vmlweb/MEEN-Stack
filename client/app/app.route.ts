//Modules
import { Ember } from 'vendor'

export const App = Ember.Route.extend({
	actions: {
		didTransition(){
			this.set('time', 'test')
		}
	}
})