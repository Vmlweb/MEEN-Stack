//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const typescript = require('typescript')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const { CheckerPlugin } = require('awesome-typescript-loader')
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin

//Config
const config = require('../../config.js')
module.exports = { setup: false, reload: false }

/*! Tasks
- server.build
- server.build.reload
*/

//! Wait
gulp.task('server.build.reload', function(done){
	let interval = setInterval(function(){
		if (module.exports.reload){
			clearInterval(interval)
			done()
		}
	}, 100)
})

//! Build
gulp.task('server.build', function(done){
	
	//Generate list of file paths to exclude
	let nodeModules = {}
	fs.readdirSync('node_modules').filter(function(x) { return ['.bin'].indexOf(x) === -1 }).forEach(function(mod) { nodeModules[mod] = 'commonjs ' + mod })
	nodeModules['config'] = 'commonjs ../config.js'
	
	//Create webpack options
	let options = {
		entry: './server/index.ts',
		target: 'node',
		devtool: 'source-map',
		externals: nodeModules,
		plugins: [
			new CheckerPlugin({ fork: true }),
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
			modules: [ './server', './node_modules' ],
			extensions: [ '.js', '.ts', '.json' ],
			plugins: [
				new PathsPlugin()
			]
		},
		module: {
			rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?presets[]=es2015'
			},{
				test: /\.ts$/,
				exclude: /node_modules/,
				loaders: [ 'awesome-typescript-loader?baseUrl=./server&target=es5&useBabel=true&useCache=true' ]
			}]
		},
	}
	
	//Add plugins for distribution
	if (process.env.NODE_ENV === 'production'){
		module.exports.options.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new WebpackObfuscator()
		)
	}
	
	//Remove source maps for distribution
	if (process.env.NODE_ENV === 'production'){
		delete module.exports.options.devtool
	}
	
	//Compile webpack and watch for changes
	webpack(options).watch({
		ignored: /node_modules/
	}, function(err, stats){
		
		//Log stats from build
		console.log(stats.toString({
			chunkModules: false,
			assets: false
		}))
		
		//Beep for success or errors
		if (process.env.NODE_ENV === 'development' && module.exports.setup){
			if (stats.hasErrors()){
				beep(2)
			}else{
				beep()
			}
		}
		
		//Reset build status variables
		module.exports.setup = true
		module.exports.reload = true
		
		done(err)
	})
})