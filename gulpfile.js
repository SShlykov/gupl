let gulp = require('gulp'),
  gp = require('gulp-load-plugins')(),
  bs = require('browser-sync').create(),
  // pugbem = require('gulp-pugbem'),
  fs = require('file-system'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify-es').default;

gulp.task('init', function(done) {
  fs.writeFile('src/stylus/style.styl', ' ');
  fs.writeFile('src/js/script.js', ' ');
  fs.writeFile('src/index.pug', ' ');
  fs.writeFile(
    'src/templates/styles.pug',
    'link(href="css/style.css", rel="stylesheet")'
  );
  fs.writeFile('src/templates/scripts.pug', 'script(src="js/script.js")');
  fs.mkdir('src/img/content');
  fs.mkdir('src/img/icons');
  done();
});

// gulp.task('pug', function() {
//   return gulp
//     .src('src/*.pug')
//     .pipe(
//       gp.pug({
//         plugins: [pugbem],
//         pretty: true
//       })
//     )
//     .pipe(gulp.dest('dist/'))
//     .on('end', bs.reload);
// });
gulp.task('html', () => {
  return gulp
    .src('src/*.html')
    .pipe(gulp.dest('dist/'))
    .on('end', bs.reload);
});

gulp.task('serve', function() {
  bs.init({
    server: {
      baseDir: './dist/'
    }
  });
});

gulp.task('stylus', function() {
  return (
    gulp
      .src('src/css/*.css')
      .pipe(gp.sourcemaps.init())
      // .pipe(
      //   gp.stylus({
      //     'include css': true
      //   })
      // )
      .pipe(
        gp.autoprefixer({
          browsers: ['last 10 versions'],
          cascade: false
        })
      )
      .on(
        'error',
        gp.notify.onError({
          title: 'style error'
        })
      )
      .pipe(gp.csso())
      // .pipe(gp.sourcemaps.write())
      .pipe(gulp.dest('dist/css/'))
      .pipe(
        bs.reload({
          stream: true
        })
      )
  );
});

gulp.task('pureJS', function() {
  return gulp
    .src('src/js/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .on('end', bs.reload);
});

// gulp.task('imgReload', function() {
//   return gulp
//     .src('src/img/**/*.*')
//     .pipe(gulp.dest('dist/img'))
//     .on('end', bs.reload);
// });

gulp.task('movePublic', function() {
  return gulp
    .src('src/public/**/*')
    .pipe(gulp.dest('./dist/public'))
    .on('end', bs.reload);
});

gulp.task('watch', function() {
  gulp.watch('src/css/**/*.css', gulp.series('stylus'));
  gulp.watch('src/**/*.html', gulp.series('html'));
  gulp.watch('src/**/*.js', gulp.series('pureJS'));
  gulp.watch('src/**/*.*', gulp.series('movePublic', 'html'));
});

gulp.task(
  'default',
  gulp.series(
    gulp.parallel('html', 'stylus', 'pureJS', 'movePublic'),
    gulp.parallel('watch', 'serve')
  )
);
