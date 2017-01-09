//Modules
import * as path from 'path'
import * as async from 'async'
import * as express from 'express'

//Includes
import { config, log, express as app, httpServer, httpConnections, httpsServer, httpsConnections, mongooseConnection } from 'app'

//Load client frontend
app.use('/', express.static('./client'))

log.info('Loaded static client route')

//API V1
require.ensure([], function(require){
	let api: any = require('api_v1')
	app.use('/api/v1', api.router)
	log.info('Loaded REST API v1 with ' + api.endpoints.length + ' endpoints')
});

//Shutdown services
const shutdown = (callback) => {
	log.info('Shutting down gracefully...')
	
	//Run all shutdown tasks in series
	async.series([
		(done) => {
		    
			//HTTP
		    if (httpServer){
			    
			    //Destroy existing keep-alive connections
				setTimeout(() => {
					log.info('HTTP connections destroyed')
					for (let i of Object.keys(httpConnections)){
						httpConnections[i].destroy()
					}
				}, 3000).unref()
			    
			    //Close server and socket
			    httpServer.close(() => {
					done()
				})
			}else{
				done()
			}
			
		}, (done) => {

			//HTTPS
			if (httpsServer){
			
				//Destroy existing keep-alive connections
				setTimeout(() => {
					log.info('HTTPS connections destroyed')
					for (let i of Object.keys(httpsConnections)){
						httpsConnections[i].destroy()
					}
				}, 3000).unref()
			
				//Close server and socket
			    httpsServer.close(() => {
					done()
				})
			}else{
				done()
			}
			
		}, (done) => {

			//MongoDB
			if (mongooseConnection){
				
				//Destroy database connections
				if (config.database.repl.nodes.length > 0){
					mongooseConnection.close(() => {
						done()
					})
				}else{
					done()
				}
			}
			
		}
	], (err) => {
		if (callback){
			callback(err)
		}
	})
}

//Graceful shutdown
const force = (error) => {
	
	//Exit with or without error
	if (error){
		log.error(error)
		process.exit(1)
	}else{
		process.exit()
	}
	
	//Shutdown timeout after 4 seconds
	setTimeout(() => {
		log.error('Shutdown timed out, force quitting')
		process.exit()
	}, 2000)
}

//Intercept kill and end signals
process.on('SIGTERM', () => { shutdown(force) })
process.on('SIGINT', () => { shutdown(force) })

export { shutdown, force }