//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const webpack = require('webpack')
const obfuscator = require('webpack-obfuscator')

//Config
const config = require('../../config.js')
module.exports = { webpack: undefined, options: undefined }

/*! Tasks
- server.build

- server.build.setup
- server.build.compile
*/

//! Build
gulp.task('server.build', gulp.series(
	'server.build.setup',
	'server.build.compile'
))

//Setup webpack for compilation
gulp.task('server.build.setup', function(done){
	
	//Generate list of file paths to exclude
	let nodeModules = {}
	fs.readdirSync('node_modules').filter(function(x) { return ['.bin'].indexOf(x) === -1 }).forEach(function(mod) { nodeModules[mod] = 'commonjs ' + mod })
	nodeModules['config'] = 'commonjs ../config.js'
	
	//Create options
	module.exports.options = {
		entry: './server/index.js',
		target: 'node',
		devtool: 'inline-source-map',
		externals: nodeModules,
		plugins: [],
		output: {
			path: './builds/server',
			filename: 'index.js'
		},
		resolve: {
			modules: [ './server', './node_modules' ]
		},
		module: {
			rules: [{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}]
		},
	}
	
	//Add plugins for distribution
	if (process.env.NODE_ENV === 'dist'){
		module.exports.options.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new obfuscator()
		)
	}
	
	//Remove source maps for distribution
	if (process.env.NODE_ENV === 'dist'){
		delete module.exports.options.devtool
	}
	
	//Create webpack compiler with options
	module.exports.webpack = webpack(module.exports.options)
	
	done()
})

//Compile any changed files in webpack
gulp.task('server.build.compile', function(done){
	module.exports.webpack.run(function(err, stats){
		
		//Log stats from build
		console.log(stats.toString({
			chunkModules: false,
			assets: false
		}))
		
		//Beep for success or errors
		if (process.env.NODE_ENV === 'dev'){
			if (stats.hasErrors()){
				beep(2)
			}else{
				beep()
			}
		}
		
		done(err)
	})
})