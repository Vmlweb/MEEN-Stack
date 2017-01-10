//Modules
import { Ember } from 'vendor'

//Includes
import router from 'router'

//Create application
let app = Ember.Application.create();
app.Router = router

//Find and include ember files
let requireContext = require.context('./', true, /\.(component|helper|mixin|model|route|service|controller).(ts|js)$/)
requireContext.keys().forEach(file => {
	let context = requireContext(file)
	for (let name in context){
		
		//Parse and format ember type
		let url = file.split('.')
		let lowerType = url[url.length - 2]
		let type = lowerType.charAt(0).toUpperCase() + lowerType.slice(1)
		
		//Apply to ember application
		app[name + type] = context[name]
	}
})

export { app }