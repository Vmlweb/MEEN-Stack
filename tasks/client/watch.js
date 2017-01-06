//Modules
const gulp = require('gulp')

/*! Tasks 
- client.watch
*/

//! Watch
gulp.task('client.watch', function(done){
	gulp.watch([
		'client/**/*.ejs',
		'client/**/*.css',
		'client/**/*.js',
		'client/**/*.hbs',
		'client/**/*.json'
	], gulp.series('client.build.compile'))
	done()
})