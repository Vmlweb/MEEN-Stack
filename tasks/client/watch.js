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
	.on('add', function(path){ require('./build.js').setup = false })
	.on('unlink', function(path){ require('./build.js').setup = false })
	.on('addDir', function(path){ require('./build.js').setup = false })
	.on('unlinkDir', function(path){ require('./build.js').setup = false })
	done()
})