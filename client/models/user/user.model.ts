//Module
import { DS } from 'vendor';

export const User = DS.Model.extend({
	username: DS.attr('string'),
	email:  DS.attr('string')
})