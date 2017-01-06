//Modules
const gulp = require('gulp')

/*! Tasks 
- server.watch
*/

//! Watch
gulp.task('server.watch', function(done){
	gulp.watch([
		'server/**/*.js',
		'server/**/*.json'
	], gulp.series(
		'app.stop',
		'server.build.compile',
		'app.start',
		'app.attach'
	))
	done()
})