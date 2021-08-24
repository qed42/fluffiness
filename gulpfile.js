/**
 * Compile .scss source to .css
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var stripCssComments = require('gulp-strip-css-comments');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var debug = require('gulp-debug');
var cssbeautify = require('gulp-cssbeautify');

/**
 * Error handler function so we can see when errors happen.
 * @param {object} err error that was thrown
 * @returns {undefined}
 */
function handleError(err) {
  // eslint-disable-next-line no-console
  console.error(err.toString());
  this.emit('end');
}

// Variables for folder path.
var paths = {
  styles: {
    source: 'scss/**/*.scss',
    destination: 'dist/css/'
  },
  images: {
    source: 'images/**/*.{JPG,jpg,png,gif,svg}',
    destination: 'dist/images/'
  }
};

// Compile SASS.
gulp.task('build:css', async function () {
  return gulp.src(paths.styles.source)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', handleError))
    .pipe(debug({ title: 'Styles update 👉' }))
    .pipe(
      prefix({
        cascade: false
      })
    )
    .pipe(stripCssComments())
    .pipe(
      rename(function (path) {
        path.dirname = '';
        return path;
      })
    )
    .pipe(cssbeautify({
      indent: '  ',
      autosemicolon: true
    }))
    .pipe(gulp.dest(paths.styles.destination));
});

// Image optimization.
gulp.task('images', function () {
  return gulp.src(paths.images.source)
    .pipe(debug({ title: 'Optimized 👉' }))
    .pipe(imagemin())
    .pipe(
      rename(function (path) {
        path.dirname = '';
        return path;
      })
    )
    .pipe(gulp.dest(paths.images.destination));
});

// Watch
gulp.task('watch', function () {
  gulp.watch(paths.styles.source, {}, gulp.series('build:css'));
});
