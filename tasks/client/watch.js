//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch
*/

//! Watch
gulp.task('client.watch', function(done){
	
	//Styles
	gulp.watch([
		'client/**/*.css'
	], gulp.series('client.build.styles'))
	
	//Templates
	gulp.watch([
		'client/**/*.hbs'
	], gulp.series('client.build.templates'))
	
	done()
})