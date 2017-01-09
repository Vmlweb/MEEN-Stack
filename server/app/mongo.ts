//Modules
import * as path from 'path'
import * as mongoose from 'mongoose'
import * as fs from 'fs'

//Includes
import { config, log } from 'app'

//Prepare connection string
const auth = config.database.auth.username + ':' + config.database.auth.password
const nodes = config.database.repl.nodes.map((node) => {
	return node.hostname + ':' + node.port
})
const database = config.database.auth.database
const repl = 'replicaSet=' + config.database.repl.name + '&ssl=' + config.database.ssl.enabled

//Create new connection to database
setTimeout(() => {
	mongoose.connect('mongodb://' + auth + '@' + nodes.join(',') + '/' + database + '?' + repl, { 
		replset: {
			sslValidate: config.database.ssl.validate,
			sslKey: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.key)) : null,
			sslCert: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.cert)) : null,
			sslCA: config.database.ssl.validate ? fs.readFileSync(path.join('./certs', config.database.ssl.ca)) : null,
			readPreference: config.database.repl.read || 'nearest'
		}
	})
}, 400)

//Listen for database connection changes
let connection = mongoose.connection
connection.on('error', function(error){
	log.error('Error connecting to database at ' + nodes.join(','), error.message)
})
connection.once('open', function(){
	log.info('Connected ' + (config.database.ssl.enabled ? 'securely ' : '' ) + 'to database at ' + nodes.join(','))
})
connection.on('close', function(){
	log.info('Database connection ended and stream closed')
})

export { mongoose, connection as mongooseConnection }