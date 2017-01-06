//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const concat = require('gulp-concat')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const WebpackHTML = require('html-webpack-plugin')
const WebpackFavicons = require('favicons-webpack-plugin')

//Config
const config = require('../../config.js')
module.exports = { webpack: undefined, options: undefined }
let setup = false

/*! Tasks
- client.build

- client.build.css
- client.build.libraries
- client.build.setup
- client.build.compile
*/

//! Build
gulp.task('client.build', gulp.series(
	gulp.parallel(
		'client.build.libraries',
		'client.build.css',
		'client.build.setup'
	),
	'client.build.compile'
))

//Copy client library files
gulp.task('client.build.css', function(){
	return gulp.src('client/**/*.css')
		.pipe(concat('style.css'))
		.pipe(gulp.dest('build/client'))
})

//Copy client library files
gulp.task('client.build.libraries', function(){
	return gulp.src(config.libraries)
		.pipe(gulp.dest('build/client/libs'))
})

//Setup webpack for compilation
gulp.task('client.build.setup', function(done){
	
	//Create options
	module.exports.options = {
		entry: './client/index.js',
		target: 'web',
		devtool: 'inline-source-map',
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					'ENV': JSON.stringify(process.env.NODE_ENV),
					'CONFIG': JSON.stringify(config)
				}
			}),
			new WebpackFavicons({
				title: config.name,
				logo: './client/favicon.png',
				prefix: 'favicons/',
				icons: {
					appleStartup: false,
					firefox: false
				}
			}),
			new WebpackHTML({
				title: config.name,
				template: './client/index.ejs',
				minify: {
					removeComments: true,
					collapseWhitespace: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: true,
					minifyCSS: true,
					minifyURLs: true
				},
				js: config.libraries.filter((lib) => {
						return lib.endsWith('.js')
					}).map((lib) => {
						return '/libs/' + path.basename(lib)
					}),
				css: config.libraries.filter((lib) => {
						return lib.endsWith('.css')
					}).map((lib) => {
						return '/libs/' + path.basename(lib)
					}).concat([ 'style.css' ])
			})
		],
		output: {
			path: './build/client',
			filename: 'index.js'
		},
		resolve: {
			modules: [ './client', './node_modules', './bower_components' ]
		},
		module: {
			rules: [{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?presets[]=es2015'
			},
			{
				test: /\.hbs$/,
				include: /client\/templates/, // or whatever directory you have
				loader: 'ember-webpack-loaders/htmlbars-loader',
				query: {
					appPath: 'client',
					templateCompiler: '../../bower_components/ember/ember-template-compiler.js'
				}
			}, {
				test: /client\/index\.js/, // the main app file
				use: [
					{
						loader: 'ember-webpack-loaders/inject-templates-loader',
						query: {
							appPath: 'client'
						}
					}, {
						loader: 'ember-webpack-loaders/inject-modules-loader',
						query: {
							appPath: 'client'
						}
					}
				]
			}]
		}
	}
	
	//Add plugins for distribution
	if (process.env.NODE_ENV === 'dist'){
		module.exports.options.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new WebpackObfuscator()
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
gulp.task('client.build.compile', function(done){
	module.exports.webpack.run(function(err, stats){
		
		//Log stats from build
		console.log(stats.toString({
			chunkModules: false,
			assets: false
		}))
		
		//Beep for success or errors
		if (process.env.NODE_ENV === 'dev' && setup){
			if (stats.hasErrors()){
				beep(2)
			}else{
				beep()
			}
		}
		setup = true
		
		done(err)
	})
})