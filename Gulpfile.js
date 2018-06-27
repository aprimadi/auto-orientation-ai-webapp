var fs = require('fs')
var gulp = require('gulp')
var less = require('gulp-less')
var livereload = require('gulp-livereload')

gulp.task('less', function() {
  return gulp.src('./stylesheets/main.less')
    .pipe(less())
    .pipe(gulp.dest('./static/css'))
    .pipe(livereload())
})

gulp.task('watch', ['less'], function() {
  gulp.watch('stylesheets/**/*.less', ['less'])
})
