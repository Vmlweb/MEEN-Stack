//Modules
import config from 'config'
import path from 'path'
import async from 'async'
import express from 'express'

//Includes
import * as app from 'app'
import * as api_v1 from 'api_v1'

//Load client frontend
app.express.use('/', express.static('../client'))

log.info('Loaded static client route')

//Load backend api
app.express.use('/api/v1', api_v1.router)

log.info('Loaded REST API endpoints');

//Shutdown services
const shutdown = (callback) => {
	log.info('Shutting down gracefully...')
	
	//Run all shutdown tasks in series
	async.series([
		(done) => {
		    
			//HTTP
		    if (app.httpServer){
			    
			    //Destroy existing keep-alive connections
				setTimeout(() => {
					log.info('HTTP connections destroyed')
					for (let i of Object.keys(app.httpConnections)){
						app.httpConnections[i].destroy()
					}
				}, 3000).unref()
			    
			    //Close server and socket
			    app.httpServer.close(() => {
					done()
				})
			}else{
				done()
			}
		}, (done) => {

			//HTTPS
			if (app.httpsServer){
			
				//Destroy existing keep-alive connections
				setTimeout(() => {
					log.info('HTTPS connections destroyed')
					for (let i of Object.keys(app.httpsConnections)){
						app.httpsConnections[i].destroy()
					}
				}, 3000).unref()
			
				//Close server and socket
			    app.httpsServer.close(() => {
					done()
				})
			}else{
				done()
			}
		}, (done) => {

			//MongoDB
			if (app.mongooseConnection){
				
				//Destroy database connections
				if (config.database.repl.nodes.length > 0){
					app.mongooseConnection.close(() => {
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