//Modules
import { Ember } from 'vendor'

export const UserManager = Ember.Component.extend({
	
	store: Ember.inject.service(),
	
	actions: {
		create(){
			
			//
			let username = this.get('model.create.username');
			let email = this.get('model.create.email')
			
			if (username && email){
			
			this.get('store').createRecord('user', {
				username: username,
				email: email
			}).save().then(() => {
		        this.set('model.create', { username: '', email: '' });
			})
			
			}else{
				alert('Please enter valid user')
			}
		},
		remove(user){
			user.destroyRecord()
		},
		updateUsername(user, event){
			user.username = event.target.value
			user.save()
		},
		updateEmail(user, event){
			user.email = event.target.value
			user.save()
		}
	}
})