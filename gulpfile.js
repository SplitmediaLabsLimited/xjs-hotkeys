/* globals require, console, __dirname, Buffer */

(function() {
  'use strict';

  var gulp        = require('gulp'),    
    browserify  = require('browserify'),    
    source      = require('vinyl-source-stream'),           
    data        = require('gulp-data'),   
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify');    

  gulp.task('browserify', function() {
    return browserify('./src/js/lib/KeyStrokeHandler.js')
      .transform("babelify", {presets: ["es2015", "react"]})      
      .bundle()
      .pipe(source('lib.js'))
      .pipe(gulp.dest('dist/js'));
  });

  gulp.task('es2015', ['browserify'], function(done) {
    return gulp.src('./dist/js/lib.js')
      .pipe(data(function(file) {
        var content = String(file.contents);

        content = content.replace(/require/ig, '_require');

        content = '(function() {\n' + content +
          '\nmodule.exports = _require(\'KeyStrokeHandler\');\n})();';

        file.contents = new Buffer(content);
        return file;
      }))
      .pipe(rename('lib-es2015.js'))
      .pipe(gulp.dest('dist/js'));
  });

  gulp.task('uglify', function() {
    return gulp.src('./dist/js/lib.js')
      .pipe(uglify())
      .pipe(rename({ suffix: '.min', extname: '.js'}))
      .pipe(gulp.dest('./dist/js/'));
  });

  gulp.task('uglify-es2015', function() {
    return gulp.src('./dist/js/lib-es2015.js')
      .pipe(uglify())
      .pipe(rename({ suffix: '.min', extname: '.js'}))
      .pipe(gulp.dest('./dist/js/'));
  });

 
}());
