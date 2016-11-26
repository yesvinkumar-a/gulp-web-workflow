var gulp          = require('gulp'),
    jade          = require('gulp-jade'),
    browserify    = require('gulp-browserify'),
    sass          = require('gulp-sass'),
    uglify        = require('gulp-uglify'),
    gulpif        = require('gulp-if'),
    rename        = require('gulp-rename'),
    connect       = require('gulp-connect')

var env = process.env.NODE_ENV || 'development';
var dir = 'builds/development';

gulp.task('jade', function(){
  if(env === "development") {
    dir = 'builds/development';
  }
  if(env === "production") {
    dir = 'builds/production';
  }
  return gulp.src('src/templates/partials/**/*.jade')
    .pipe(jade({
      pretty : env === 'development'
    }))
    .pipe(gulp.dest(dir))
    .pipe(connect.reload());
})

gulp.task('js', function() {
  if(env === "development") {
    dir = 'builds/development';
  }
  if(env === "production") {
    dir = 'builds/production';
  }
  return gulp.src('src/js/main.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : env === 'development'
        }))
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(rename('app.js'))
        .pipe(gulp.dest(dir+"/js"))
        .pipe(connect.reload());
});

gulp.task('sass',function(){
  var config = {};
  if(env === "development") {
    config.sourceComments = "map"
    dir = 'builds/development'
  }
  if(env === "production") {
    config.outputStyle = "compressed"
    dir = 'builds/production'
  }
  return gulp.src('src/sass/main.scss')
    .pipe(sass(config))
    .pipe(rename('app.css'))
    .pipe(gulp.dest(dir+"/css"))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: dir,
    livereload: true
  });
});

gulp.task('watch', function(){
  gulp.watch('src/templates/partials/**/*.jade', ['jade'])
  gulp.watch('src/js/**/*.js', ['js'])
  gulp.watch('src/sass/**/*.scss', ['sass'])
});

gulp.task('default',['jade','js','sass','watch','connect']);
//NODE_ENV=production gulp // for production
