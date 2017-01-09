//Modules
import * as express from 'express'
const router = express.Router()

//Includes
import { Endpoint, Method } from 'app'

//Find all endpoint files
let epFiles = {};
let requireContext = require.context('./', true, /\.ep.ts$/)
requireContext.keys().forEach(key => epFiles[key] = requireContext(key))

//Loop through found endpoints
let endpoints: Endpoint[] = []
for (let file in epFiles){
	
	//Cast endpoint and add to list
	let endpoint: Endpoint = epFiles[file].default
	endpoints.push(endpoint)
	
	//Check whether url and method exists and mount on router
	if (endpoint.method == Method.Get){
		router.get(endpoint.url, endpoint.execute)
		
	}else if (endpoint.method == Method.Post){
		router.post(endpoint.url, endpoint.execute)
		
	}else if (endpoint.method == Method.Put){
		router.put(endpoint.url, endpoint.execute)
		
	}else if (endpoint.method == Method.Delete){
		router.delete(endpoint.url, endpoint.execute)
	}
}

export { router, endpoints }