const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const jslint = require('gulp-jslint');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', () => {
  return gulp.src('src/scss/litebox.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 5 versions'] }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', () => {
  return gulp.src('src/js/litebox.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', () => {
  gulp.watch('src/scss/*.scss', ['scss']);
  gulp.watch('src/js/*.js', ['js']);
});

gulp.task('default', ['js', 'scss', 'watch']);