const gulp = require('gulp');
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


gulp.task('watch', () => {
  gulp.watch('src/scss/*.scss', ['scss']);
});

gulp.task('default', ['scss', 'watch']);