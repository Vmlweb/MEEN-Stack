//Modules
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import winston from 'winston'
import rotate from 'winston-daily-rotate-file'

//Create log paths
const errorPath = '../../errors'
const infoPath = '../../info'
const accessPath = '../../access'

//Check if directories exist and create
try { fs.statSync(errorPath) } catch(e) { fs.mkdirSync(errorPath) }
try { fs.statSync(infoPath) } catch(e) { fs.mkdirSync(infoPath) }
try { fs.statSync(accessPath) } catch(e) { fs.mkdirSync(accessPath) }

//Setup logging output formatter
const formatter = (options) => {
	let format = '(' + moment().format('YYYY-MM-DD_HH-mm-ss') + ') '
    format += '[' + winston.config.colorize(options.level,options.level.toUpperCase()) + '] '
    format += options.message
    if (options.meta.length > 0){
        format += JSON.stringify(options.meta)
    }
    return format
}

//Setup log file transports
let transports = [
	new rotate({
	    name: 'error',
	    level: 'error',
	    filename: path.join(errorPath, 'error.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
    new rotate({
	    name: 'info',
	    level: 'info',
	    filename: path.join(infoPath, 'info.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
    new rotate({
	    name: 'verbose',
	    level: 'verbose',
	    filename: path.join(accessPath, 'access.json'),
	    datePattern: '.yyyy-MM-dd',
        json: true,
        colorize: false,
    }),
]

//Setup log console transports
if (process.env.NODE_ENV !== 'silent'){
	transports.push(
		new winston.transports.Console({
		    name: 'console',
            level: 'info',
            json: false,
            colorize: true,
            formatter: formatter
        }),
        new winston.transports.Console({
		    name: 'consoleError',
            level: 'error',
            json: true,
            colorize: true,
            formatter: formatter
        })
    )
}

//Setup logger with transports
const logger = new winston.Logger({
    transports: transports,
    exitOnError: false
})

//Globalize wrapped logger
global.log = {
	error: logger.error,
	warn: logger.warn,
	info: logger.info,
	verbose: logger.verbose,
	debug: logger.debug,
	silly: logger.silly,
	stream: {
		write: (message, encoding) => {
	        logger.verbose(message.replace(/^\s+|\s+$/g, ''))
	    }
	}
}

//TELL THE WORLD IT'S READY!!!!!!!!!!!
log.info('Logger initialized')

export default logger