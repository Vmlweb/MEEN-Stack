//Modules
import { Ember, DS } from 'vendor'

export const Application = DS.JSONSerializer.extend({  
	keyForAttribute(key) {
		return Ember.String.decamelize(key)
	}
})