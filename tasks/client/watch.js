//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch

- client.watch.templates
- client.watch.misc
*/

//! Watch
gulp.task('client.watch', gulp.parallel(
	'client.watch.templates',
	'client.watch.misc'
))

//Update with any changes to templates
gulp.task('client.watch.templates', function(done){
	gulp.watch([
		'client/**/*.hbs',
	], gulp.series('client.build.templates'))
	done()
})

//Update with any changes to source
gulp.task('client.watch.misc', function(done){
	gulp.watch([
		'client/**/*.ejs',
		'client/**/*.css',
		'client/**/*.js',
		'client/**/*.json'
	], gulp.series('client.build.compile'))
	done()
})