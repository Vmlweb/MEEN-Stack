//Modules
import { Ember } from 'vendor'

export default Ember.Router.map(function() {
	this.route('app', { path: '/' }, function(){
		this.route('home')
		this.route('work')
	})
})