var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
sass.compiler = require('node-sass');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('sass', function () {
  return gulp.src(paths.sass)    
  .pipe(sass.sync()
  .on('error', sass.logError))
  .pipe(gulp.dest('./www/css/'))
  .pipe(cleanCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('./www/css/'))
  //.on('end', done);
});
 
gulp.task('sass:watch', function () {
  gulp.watch(paths.sass, ['sass']);
});