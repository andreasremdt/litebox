const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const jslint = require('gulp-jslint');
const rename = require('gulp-rename');

gulp.task('compilejs', () => {
  return gulp.src('src/js/litebox.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('compressjs', () => {
  return gulp.src('src/js/litebox.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['compressjs']);