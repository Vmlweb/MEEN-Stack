export default Ember.Router.map(function() {
	this.route('index', { path: '/' }, function(){
		this.route('home')
		this.route('work')
	})
})