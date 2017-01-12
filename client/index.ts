//Modules
declare var process: any
import { Ember } from 'vendor'

//Includes
import router from 'router'

//Create application and router
let app = Ember.Application.create();
app.Router = router
app.Router.reopen({
  location: 'auto'
})

//Find and include ember files
let requireContext = require.context('./', true, /\.(component|helper|mixin|model|route|service|controller|adapter|serializer).(ts|js)$/)
requireContext.keys().forEach(file => {
	let context = requireContext(file)
	for (let name in context){
		
		//Parse and format ember type
		let url = file.split('.')
		let lowerType = url[url.length - 2]
		let type = lowerType.charAt(0).toUpperCase() + lowerType.slice(1)
		
		//Decide property to use
		let property = name + type
		
		//Apply to ember application
		app[name + type] = context[name]
		
		//Log loaded class
		if (process.env.NODE_ENV === 'development'){
			console.log('Ember loaded ' + property)
		}
	}
})

export { app }