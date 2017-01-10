//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const fs = require('fs')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const wrap = require('gulp-wrap')
const templates = require('gulp-ember-templates')
const webpack = require('webpack')
const WebpackObfuscator = require('webpack-obfuscator')
const WebpackHTML = require('html-webpack-plugin')
const WebpackFavicons = require('favicons-webpack-plugin')
const PathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const { CheckerPlugin } = require('awesome-typescript-loader')

//Config
const config = require('../../config.js')
module.exports = { setup: false, watch: undefined }

/*! Tasks
- client.build

- client.build.styles
- client.build.libs
- client.build.templates
- client.build.compile
- client.build.recompile
*/

//! Build
gulp.task('client.build', gulp.series(
	gulp.parallel(
		'client.build.styles',
		'client.build.libs',
		'client.build.templates'
	),
	'client.build.compile'
))

//Copy and concat stylesheets
gulp.task('client.build.styles', function(){
	return gulp.src('client/**/*.css')
		.pipe(sourcemaps.init())
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/client'))
})

//Copy client library files
gulp.task('client.build.libs', function(){
	return gulp.src(config.libs)
		.pipe(gulp.dest('build/client/libs'))
})

//Copy and concat handlebar templates
gulp.task('client.build.templates', function(){
	return gulp.src('client/**/*.hbs')
		.pipe(sourcemaps.init())
		.pipe(templates({
			compiler: require('../../bower_components/ember/ember-template-compiler'),
			isHTMLBars: true,
			name: function(name, done){
				
				//Replace filenames at end of url which duplicate such as app/app
				let url = name.split('/')
				if (url[url.length - 1] === url[url.length - 2]){
					done(null, name.replace(new RegExp('/' + url[url.length - 1] + '$', 'g'), ''))
				}else{
					done(null, name)
				}
			}
		}))
		.pipe(concat('templates.js'))
		.pipe(wrap('window.Templates = function(Ember){<%= contents %>}'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/client'))
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
					}).concat([ 'templates.js' ]),
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
			extensions: [ '.js', '.ts', '.json', '.png', '.jpg', '.jpeg', '.gif' ],
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
	
	//Prepare callback for compilation completion
	let callback = function(err, stats){
		
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
	}
	
	//Compile webpack and watch if developing
	if (process.env.NODE_ENV === 'development'){
		module.exports.watch = webpack(options).watch({
			ignored: /(node_modules|bower_components)/
		}, callback)
	}else{
		webpack(options).run(callback)
	}
})

//Expires the current webpack watch and recompiles
gulp.task('client.build.recompile', function(done){
	module.exports.watch.invalidate()
	done()
})