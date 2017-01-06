//Modules
import config from 'config'
import path from 'path'
import mongoose from 'mongoose'
import fs from 'fs'

//Prepare connection string
const auth = config.database.auth.username + ':' + config.database.auth.password
const nodes = config.database.repl.nodes.map((node) => {
	return node.hostname + ':' + node.port
})
const database = config.database.auth.database
const repl = 'replicaSet=' + config.database.repl.name + '&ssl=' + config.database.ssl.enabled

//Create new connection to database
mongoose.connect('mongodb://' + auth + '@' + nodes.join(',') + '/' + database + '?' + repl, { 
	replset: {
		sslValidate: config.database.ssl.validate,
		sslKey: config.database.ssl.validate ? fs.readFileSync(path.join('../../certs', config.database.ssl.key)) : null,
		sslCert: config.database.ssl.validate ? fs.readFileSync(path.join('../../certs', config.database.ssl.cert)) : null,
		sslCA: config.database.ssl.validate ? fs.readFileSync(path.join('../../certs', config.database.ssl.ca)) : null,
		readPreference: config.database.repl.read || 'nearest'
	}
})

//Listen for database connection changes
mongoose.connection.on('error', function(error){
	log.error('Error connecting to database at ' + nodes.join(','), error.message)
})
mongoose.connection.once('open', function(){
	log.info('Connected ' + (config.database.ssl.enabled ? 'securely ' : '' ) + 'to database at ' + nodes.join(','))
})
mongoose.connection.on('close', function(){
	log.info('Database connection ended and stream closed')
})

export { mongoose, mongoose.connection as mongooseConnection }