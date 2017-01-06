//Modules
const gulp = require('gulp');
const shell = require('gulp-shell');
const del = require('del');
const docker = require('dockerode')();
const uglify = require('gulp-uglify')
const beep = require('beepbeep');
const harmony = require('uglify-js-harmony')
const obfuscator = require('gulp-js-obfuscator')

//Config
let config = require('../config.js');

/*! Tasks 
- dist.reset
- dist.build

- dist.copy
- dist.copy.certs
- dist.copy.config
- dist.copy.server
- dist.copy.client
*/

//Empty distribution directory
gulp.task('dist.reset', function(){
	return del(['dist/**/*']);
});

//Build the docker image for app
gulp.task('dist.image', shell.task([
	'docker build -t ' + config.name + '_app $PWD',
	'docker save ' + config.name + '_app > ' + config.name + '_app.tar',
	'zip ' + config.name + '_app.zip ' + config.name + '_app.tar',
	'rm -r ' + config.name + '_app.tar',
	'chmod +x server.sh'
],{
	verbose: true,
	cwd: 'dist'
}));

//! Build
gulp.task('dist.build', gulp.parallel(
	'dist.build.config',
	'dist.build.libs',
	'dist.build.js.server',
	'dist.build.js.client',
	'dist.build.js.clien2t'
));

//Copy over config files
gulp.task('dist.build.config', function(){
	return gulp.src([
		'builds/config.js',
		'builds/package.json',
		'builds/Dockerfile',
		'builds/docker-compose.yml',
		'builds/mongodb.js',
		'builds/server.sh',
		'builds/database.sh'
	])
	.pipe(gulp.dest('dist'));
});

//Copy over server source files
gulp.task('dist.build.libs', function(done){
	return gulp.src('builds/client/libs/**/*.js')
		.pipe(gulp.dest('dist/client/libs'));
});

//Copy over server source files
gulp.task('dist.build.js.server', function(done){
	done();
	return;
	
	return gulp.src('builds/server/**/*.js')
		.pipe(uglify())
		.on('error', function(err){
			beep(2);
			console.log(err);
		})
		.pipe(gulp.dest('dist/server'));
});

//Copy over server source files
gulp.task('dist.build.js.clien2t', function(){
	return gulp.src([
		'builds/server/**/*.js'
	])
	.pipe(uglify())
	.on('error', function(err){
		beep(2);
		console.log(err);
	})
	.pipe(gulp.dest('dist/server'));
});

//Copy over server source files
gulp.task('dist.build.js.client', function(){
	return gulp.src([
		'builds/client/**/*.js',
		'!builds/client/libs/**/*.js'
	])
	.pipe(uglify())
	.pipe(obfuscator())
	.on('error', function(err){
		beep(2);
		console.log(err);
	})
	.pipe(gulp.dest('dist/client'));
});