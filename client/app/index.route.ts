//Modules
import { Ember } from 'vendor'

export const AppIndex = Ember.Route.extend({
	beforeModel() {
		this.replaceWith('app.home')
	}
})