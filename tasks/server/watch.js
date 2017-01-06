//Modules
const gulp = require('gulp')

/*! Tasks 
- server.watch

- server.watch.misc
- server.watch.js
*/

//! Watch
gulp.task('server.watch', gulp.parallel(
	'server.watch.misc',
	'server.watch.js'
))

//Watch for source file changes
gulp.task('server.watch.misc', function(done){
	gulp.watch([
		'server/**/*',
		'!server/**/*.js'
	], gulp.series('server.build'))
	done()
})

//Watch for source file changes
gulp.task('server.watch.js', function(done){
	gulp.watch([
		'server/**/*.js'
	], gulp.series('server.build'))
	done()
})