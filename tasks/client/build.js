//Modules
const gulp = require('gulp')
const path = require('path')
const beep = require('beepbeep')
const concat = require('gulp-concat')
const template = require('gulp-ember-templates')
const sourcemap = require('gulp-sourcemaps')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const inject = require('gulp-inject')
const sort = require('sort-stream')
const watchify = require('watchify')
const eslint = require('gulp-eslint')

//Config
let config = require('../../config.js')
let setup = false;

/*! Tasks 
- client.build

- client.build.source
- client.build.source.index
- client.build.source.misc
- client.build.source.css
- client.build.source.libs
- client.build.source.templates
- client.build.source.js

- client.build.inject
*/

//! Build
gulp.task('client.build', gulp.series(
	'client.build.source',
	'client.build.inject'
))

//! Source
gulp.task('client.build.source', gulp.parallel(
	'client.build.source.index',
	'client.build.source.misc',
	'client.build.source.css',
	'client.build.source.libs',
	'client.build.source.templates',
	'client.build.source.js'
))

//Copy misc client files
gulp.task('client.build.source.index', function(){
	return gulp.src('client/index.html')
		.pipe(gulp.dest('builds/client'))
})

//Copy misc client files
gulp.task('client.build.source.misc', function(){
	return gulp.src([
		'client/**/*',
		'!client/**/*.css',
		'!client/**/*.hbs',
		'!client/**/*.js'
	])
	.pipe(gulp.dest('builds/client'))
	.on('end', function(){
		if (setup){ beep(); }
	})
})

//Copy client css files
gulp.task('client.build.source.css', function(){
	return gulp.src('client/**/*.css')
		.pipe(concat('app.css'))
		.pipe(gulp.dest('builds/client'))
		.on('end', function(){
			if (setup){ beep(); }
		})
})

//Copy client library files
gulp.task('client.build.source.libs', function(){
	return gulp.src(config.libraries)
		.pipe(gulp.dest('builds/client/libs'))
})

//Generate precompiled templates file
gulp.task('client.build.source.templates', function(){
	return gulp.src('client/**/*.hbs')
		.pipe(template({
			compiler: require('../../bower_components/ember/ember-template-compiler'),
			isHTMLBars: true
		}))
		.on('error', function(err){
			beep(2);
			console.log(err.stack);
			this.emit('end');
		})
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('builds/client'))
		.on('end', function(){
			if (setup){ beep(); }
		})
})

module.exports = {};

//Setup browserify with configurations
module.exports.browserify = browserify(Object.assign({}, watchify.args, {
	entries: 'client/index.js',
	debug: true,
	insertGlobalVars: {
		ENV: function(file, dir){ JSON.stringify(process.env.NODE_ENV) },
		CONFIG: function(file, dir){ JSON.stringify(config) }
	}
}))

//Setup watchify to monitor and update build live
module.exports.watchify = function(){
	module.exports.browserify = watchify(module.exports.browserify);
	module.exports.browserify.on('update', function(){
		module.exports.bundle()
	});
	module.exports.browserify.on('log', function(log){
		console.log(log);
	});
	module.exports.bundle();
	setup = true;
}

//Setup build and source map pipeline
module.exports.bundle = function(){
	return module.exports.browserify
		.transform(babelify.configure({
			presets: ['es2015']
		}))
		.bundle()
		.on('error', function(err){
			beep(2);
			console.log(err.stack);
			this.emit('end');
		})
		.pipe(source('index.js'))
		.pipe(buffer())
		.pipe(sourcemap.init({ loadMaps: true }))
		.pipe(sourcemap.write('./'))
    	.pipe(gulp.dest('builds/client'))
		.on('end', function(){
			if (setup){ beep(); }
		})
}

//Generated compiled client javascript file
gulp.task('client.build.source.js', module.exports.bundle)

//Inject js and css files into html
gulp.task('client.build.inject', function(){
	
	//Create list of library filenames
	let libs = []
	for (let i in config.libraries){
		libs.push(path.basename(config.libraries[i]))
	}
	
	//Find and sort injectable files by library order
	let sorted = gulp.src([
		'builds/client/libs/**/*.js',
		'builds/client/libs/**/*.css',
		'builds/client/*.css',
		'builds/client/*.js'
	], { read: false }).pipe(sort(function(a, b){
		
		//Check whether filename exists in libraries and return order
		let index1 = libs.indexOf(path.basename(a.path))
		let index2 = libs.indexOf(path.basename(b.path))
		
		//Return copmarison result
		if (index1 == -1 || index2 == -1){
			return -1
		}else if (index1 > index2){
			return 1
		}else if (index1 < index2){
			return -1
		}else{
			return 0
		}
	}))
	
	return gulp.src('builds/client/index.html')
		.pipe(inject(sorted, { relative: true }))
    	.pipe(gulp.dest('builds/client'))
})