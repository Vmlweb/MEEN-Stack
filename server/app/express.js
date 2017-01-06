//Modules
import config from 'config'
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import morgan from 'morgan'
import recursive from 'recursive-readdir'
import async from 'async'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import filter from 'content-filter'
import express from 'express'
const app = express()

log.info('Express initialized')

//Attach request logger
app.use(require('morgan')(config.logs.format, { 'stream': log.stream }))

//Attach express middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(filter())
app.use(helmet())
app.use(compression())

log.info('Express middleware attached')

//Check whether HTTP hotname was given
let httpServer;
let httpConnections = {};
if (config.http.hostname.length > 0){
	
	//Create server and listen
	httpServer = http.createServer(app).listen(config.http.port.internal, config.http.hostname)
	
	//Listen for new connections
	httpServer.on('connection', function(conn){
		let key = conn.remoteAddress + ':' + conn.remotePort
	    httpConnections[key] = conn
	    conn.on('close', function() {
		    delete httpConnections[key]
	    })
	})
	
	//Log connection status
	httpServer.on('close', function(){
		log.info('HTTP server ended and stream closed')
	})
	log.info('HTTP listening at ' + config.http.hostname + ':' + config.http.port.internal)
}

//Check whether HTTPS hotname was given
let httpsServer;
let httpsConnections = {};
if (config.https.hostname.length > 0 && config.https.ssl.key.length > 0 && config.https.ssl.cert.length > 0){
	
	//Create server and listen
	httpsServer = https.createServer({
		key: fs.readFileSync(path.join('./certs', config.https.ssl.key)) || '',
		cert: fs.readFileSync(path.join('./certs', config.https.ssl.cert)) || ''
	}, app).listen(config.https.port.internal, config.https.hostname)
	
	//Listen for new connections
	httpsServer.on('connection', function(conn){
		let key = conn.remoteAddress + ':' + conn.remotePort
	    httpsConnections[key] = conn
	    conn.on('close', function() {
		    delete httpsConnections[key]
	    })
	})
	
	//Log connection status
	httpsServer.on('close', function(){
		log.info('HTTPS server ended and stream closed')
	})
	log.info('HTTPS listening at ' + config.https.hostname + ':' + config.https.port.internal)
}

//Server static client files
app.use(express.static('../../client'))

log.info('Loaded static client route')
/*
//Load api calls from file
recursive(__api, function (err, files) {
	
	//Remove all non router files
	let includeFiles = []
	for (let i=0 i<files.length i++){
		if (files[i].indexOf('.get.js') >= 0 ||
			files[i].indexOf('.post.js') >= 0 ||
			files[i].indexOf('.put.js') >= 0 ||
			files[i].indexOf('.delete.js') >= 0){
			includeFiles.push(files[i])
		}
	}
	
	//Routing handler for api calls
	if (err){
		log.error(err.message)	
	}else{
		
		//Log endpoint count
		log.info('Loaded ' + includeFiles.length + ' api endpoints')
		
		//Import individual api routers
		for (let a=0 a<includeFiles.length a++){
			let route = require('../api/' + includeFiles[a] + '.js')
			app.use('/api', route)
		}
	}
	
	log.info('Setup routes for api endpoints')
	
	//Error handler for server side api requests
	app.use('/api', function(req, res, next){
		res.status(404).json({ error: 'NotFoundError' })
	})
	app.use('/api', function(err, req, res, next){
		if (err instanceof String || typeof err === 'string'){
			
			//User error 
			res.status(200).json({ error: err })
		}else{
			
			//Interal server error
			if (err.hasOwnProperty('message') && err.hasOwnProperty('error')){
				log.error(err.message, err.error)
			}else if (err.hasOwnProperty('message')){
				log.error(err.message, err.stack)
			}else if (err.hasOwnProperty('error')){
				log.error(err.error)
			}else{
				log.error('Internal server error', err.stack)	
			}
			res.status(500).json({ error: 'ServerError' })
		}
	})
	
	//Error handler for client side requests
	app.get('*', function(req, res, next){
		res.status(404).redirect('/errors/404.html')
	})
	app.get('*', function(err, req, res, next){
		log.error(err.stack)
		res.status(500).redirect('/errors/500.html')
	})

	log.info('Setup error handling routes')
})*/

export { app as express, httpServer, httpConnections, httpsServer, httpsConnections }