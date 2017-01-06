//Modules
const gulp = require('gulp');
const jshint = require('gulp-jshint');

/*! Tasks 
- server.lint

- server.lint.css
- server.lint.js
*/

//! Lint
gulp.task('server.lint', gulp.parallel('server.lint.js'));

//Validate javascript syntax
gulp.task('server.lint.js', function(){
	return gulp.src('server/**/*.js')
		.pipe(jshint({
			esversion: 6,
			asi: true
		}))
	    .pipe(jshint.reporter());
});