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
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const { CheckerPlugin } = require('awesome-typescript-loader')

//Config
const config = require('../../config.js')
module.exports = { setup: false }

/*! Tasks
- client.build

- client.build.css
- client.build.libraries
- client.build.compile
*/

//! Build
gulp.task('client.build', gulp.series(
	'client.build.libraries',
	'client.build.css',
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
	return gulp.src(config.libs)
		.pipe(gulp.dest('build/client/libs'))
})

//Setup webpack for compilation
gulp.task('client.build.compile', function(done){
	
	//Create options
	let options = {
		entry: { 
			index: './client/index.ts',
			vendor: './client/vendor.ts'
		},
		target: 'web',
		devtool: 'source-map',
		plugins: [
			new CheckerPlugin({ fork: true }),
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
				js: config.libs.filter((lib) => {
						return lib.endsWith('.js')
					}).map((lib) => {
						return '/libs/' + path.basename(lib)
					}),
				css: config.libs.filter((lib) => {
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
			},
			plugins: [
				new PathsPlugin()
			]
		},
		module: {
			rules: [{
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: 'file-loader?name=images/[hash].[ext]&publicPath=&outputPath='
			},{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?presets[]=es2015'
			},{
				test: /\.ts$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'awesome-typescript-loader',
				query: {
					instance: 'client',
					lib: ['dom', 'es6'],
					target: 'es6',
					types: config.types.client,
					baseUrl: './client',
					useBabel: true,
					useCache: true
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
						query: { appPath: 'client' }
					},{
						loader: 'ember-webpack-loaders/inject-modules-loader',
						query: { appPath: 'client' }
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
	
	//Compile webpack and watch for changes
	webpack(options).watch({
		ignored: /(node_modules|bower_components)/
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
		
		done(err)
	})
})