//Modules
const gulp = require('gulp');
const watchify = require('watchify')

/*! Tasks 
- client.watch

- client.watch.misc
- client.watch.css
- client.watch.templates
- client.watch.js
*/

//! Watch
gulp.task('client.watch', gulp.parallel(
	'client.watch.misc',
	'client.watch.css',
	'client.watch.templates',
	'client.watch.js'
));

//Watch for source file changes
gulp.task('client.watch.misc', function(done){
	gulp.watch([
		'client/**/*',
		'!client/**/*.css',
		'!client/**/*.hbs',
		'!client/**/*.js'
	], gulp.series('client.build.source.misc'));
	done();
});

//Watch for source file changes
gulp.task('client.watch.css', function(done){
	gulp.watch('client/**/*.css', gulp.series('client.build.source.css'));
	done();
});

//Watch for source file changes
gulp.task('client.watch.templates', function(done){
	gulp.watch('client/**/*.hbs', gulp.series('client.build.source.templates'));
	done();
});

//Watch for source file changes
gulp.task('client.watch.js', function(done){
	require('./build.js').watchify();
});