//Modules
const gulp = require('gulp')
const path = require('path')
const fs = require('fs')
const stream = require('webpack-stream')
const webpack = require('webpack')
const named = require('vinyl-named')
const through = require('through2')
const sourcemaps = require('gulp-sourcemaps')
const obfuscator = require('webpack-obfuscator')

//Config
let config = require('../../config.js')

//Compile list of node modules for webpack
let nodeModules = {}
fs.readdirSync('node_modules').filter(function(x) { return ['.bin'].indexOf(x) === -1 }).forEach(function(mod) { nodeModules[mod] = 'commonjs ' + mod })
nodeModules['config'] = 'commonjs ../config.js'

/*! Tasks
- server.build
*/

//! Build

gulp.task('server.build', function(){
	
	let plugins = [
	//	new webpack.optimize.UglifyJsPlugin(),
	//	new obfuscator()
	];
	
	
	
	return gulp.src('./server/index.js')
		.pipe(named())
		.pipe(stream({
			target: 'node',
			devtool: 'inline-source-map',
			externals: nodeModules,
			plugins: plugins,
			output: {
				filename: 'index.js'
			},
			resolve: {
				modules: [ 'server', 'node_modules' ]
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
		}, webpack))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(through.obj(function (file, enc, cb) {
			var isSourceMap = /\.map$/.test(file.path);
			if (!isSourceMap) this.push(file);
			cb();
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('builds/server'))
})