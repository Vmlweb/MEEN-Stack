//Modules
import { Ember, DS } from 'vendor';

export const Application = DS.RESTAdapter.extend({
	namespace: 'api/v1',
	
	pathForType(type) {
		return Ember.String.pluralize(type.replace(/-model/g, ''))
	}
})