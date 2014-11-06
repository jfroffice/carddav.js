var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    wrap = require('gulp-wrap-umd'),
    pkg = require('./package.json'),
    stylish = require('jshint-stylish'),
    path = pkg.path,
    port = 6000;

gulp.task('js', function() {
    return gulp.src('./src/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('connect', function() {
    $.connect.server({
        root: '.',
        port: port,
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('demo/*.html')
        .pipe($.connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./src/*.js'], ['js']);
});

gulp.task('default', ['connect', 'watch']);

/* build tasks */

var rimraf = require('rimraf');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('clean', function(cb){
    rimraf('./dist', cb);
});

gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe($.bump())
  .pipe(gulp.dest('./'));
});

gulp.task('concat', function() {
    gulp.src(path.js)
        .pipe($.concat('carddav.js'))
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
    gulp.src(['dist/carddav.js'])
        .pipe($.uglify())
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe($.rename(function (path) {
            if(path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('build', ['clean', 'concat', 'uglify']);
gulp.task('release', ['bump', 'build', 'build']);
