//Modules
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const csslint = require('gulp-csslint');

/*! Tasks 
- client.lint

- client.lint.css
- client.lint.js
*/

//! Lint
gulp.task('client.lint', gulp.parallel('client.lint.css', 'client.lint.js'));

//Validate css syntax
gulp.task('client.lint.css', function(){
	return gulp.src('client/**/*.css')
	    .pipe(csslint())
	    .pipe(csslint.formatter());
});

//Validate javascript syntax
gulp.task('client.lint.js', function(){
	return gulp.src('client/**/*.js')
		.pipe(jshint({
			esversion: 6,
			asi: true
		}))
	    .pipe(jshint.reporter());
});