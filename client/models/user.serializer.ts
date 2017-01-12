//Modules
import { Ember, DS } from 'vendor';

export const User = DS.JSONSerializer.extend({
  
	primaryKey: 'userId',
	
	normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
		return this._super(store, primaryModelClass, payload.users, id, requestType)
	}
})