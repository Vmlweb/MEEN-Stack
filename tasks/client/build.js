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
module.exports = { webpack: undefined, options: undefined, setup: false }

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
		entry: { 
			index: './client/index.js',
			vendor: './client/vendor.js'
		},
		target: 'web',
		devtool: 'source-map',
		plugins: [
			new webpack.IgnorePlugin(/vertx/),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor'
			}),
			new webpack.ProvidePlugin({
			    $: 'jquery',
			    jQuery: 'jquery'
			}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.CONFIG': JSON.stringify(config)
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
		performance: {
			hints: false
		},
		output: {
			path: './build/client',
			filename: '[name].js'
		},
		resolve: {
			modules: [ './client', './bower_components', './node_modules' ],
			alias: {
				ember: process.env.NODE_ENV === 'production' ? 'ember/ember.min' : 'ember/ember.debug',
				jquery: process.env.NODE_ENV === 'production' ? 'jquery/dist/jquery.min' : 'jquery/src/jquery'
			}
		},
		module: {
			rules: [{
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: 'file-loader?name=images/[hash].[ext]&publicPath=&outputPath='
			}, {
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			},{
				test: /\.hbs$/,
				include: /client\/templates/,
				loader: 'ember-webpack-loaders/htmlbars-loader',
				query: {
					appPath: 'client',
					templateCompiler: '../../bower_components/ember/ember-template-compiler.js'
				}
			},{
				test: /client\/index\.js/,
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
	if (process.env.NODE_ENV === 'production'){
		module.exports.options.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
			new WebpackObfuscator({}, 'vendor.js'),
			new WebpackFavicons({
				title: config.name,
				logo: './client/favicon.png',
				prefix: 'favicons/',
				icons: {
					appleStartup: false
				}
			})
		)
	}
	
	//Remove source maps for distribution
	if (process.env.NODE_ENV === 'production'){
		delete module.exports.options.devtool
	}
	
	done()
})

//Compile any changed files in webpack
gulp.task('client.build.compile', function(done){
	
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