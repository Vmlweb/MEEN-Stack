//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const webpack = require('webpack')
const obfuscator = require('webpack-obfuscator')

//Config
const config = require('../../config.js')
module.exports = { webpack: undefined, options: undefined, setup: false }

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
		devtool: 'source-map',
		externals: nodeModules,
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.CONFIG': JSON.stringify(config)
			})
		],
		performance: {
			hints: false
		},
		output: {
			path: './build/server',
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
	if (process.env.NODE_ENV === 'production'){
		module.exports.options.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new obfuscator()
		)
	}
	
	//Remove source maps for distribution
	if (process.env.NODE_ENV === 'production'){
		delete module.exports.options.devtool
	}
	
	done()
})

//Compile any changed files in webpack
gulp.task('server.build.compile', function(done){
	
	//Create new webpack object if setup is needed
	if (!module.exports.setup){
		module.exports.webpack = webpack(module.exports.options)
	}
	module.exports.setup = true
	
	//Run difference compilation for webpack
	module.exports.webpack.run(function(err, stats){
		
		//Log stats from build
		console.log(stats.toString({
			chunkModules: false,
			assets: false
		}))
		
		//Beep for success or errors
		if (process.env.NODE_ENV === 'development'){
			if (stats.hasErrors()){
				beep(2)
			}else{
				beep()
			}
		}
		
		done(err)
	})
})