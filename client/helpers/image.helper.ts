//Modules
import { Ember } from 'vendor'

export const Image = Ember.Helper.helper((params) => {
	return require('images/' + params)
})