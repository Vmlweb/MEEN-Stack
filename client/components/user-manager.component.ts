//Modules
import { Ember } from 'vendor'
import { app } from 'index'

export const UserManager = Ember.Component.extend({
	
	store: Ember.inject.service(),
	
	actions: {
		create(){
						
			//Collect new user fields
			let username = this.get('model.create.username');
			let email = this.get('model.create.email')
			
			//Check whether username and email were given
			if (username && email){			
				
				//Create new user and save
				this.get('store').createRecord('user', {
					username: username,
					email: email
				}).save().then(() => {
			    
			    	//Reset new user fields
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