const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const server = require(`browser-sync`).create();
const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const del = require(`del`);
const uglify = require(`gulp-uglify`);
const webpackStream = require(`webpack-stream`);
const webpackConfig = require(`./webpack.config.js`);

gulp.task(`css`, function () {
  return gulp.src(`source/sass/style.scss`)
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([autoprefixer({
        grid: true,
      })]))
      .pipe(gulp.dest(`build/css`))
      .pipe(csso())
      .pipe(rename(`style.min.css`))
      .pipe(sourcemap.write(`.`))
      .pipe(gulp.dest(`build/css`))
      .pipe(server.stream());
});

gulp.task(`script`, function () {
  return gulp.src([`source/js/main.js`])
      .pipe(webpackStream(webpackConfig))
      .pipe(uglify())
      .pipe(gulp.dest(`build/js`));
});

gulp.task(`server`, function () {
  server.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch(`source/*.html`, gulp.series(`copy`, `refresh`));
  gulp.watch(`source/sass/**/*.{scss,sass}`, gulp.series(`css`));
  gulp.watch(`source/js/**/*.js`, gulp.series(`script`, `refresh`));
});

gulp.task(`refresh`, function (done) {
  server.reload();
  done();
});

gulp.task(`copy`, function () {
  return gulp.src([
    `source/fonts/**/*.{woff,woff2}`,
    `source/*.html`
  ], {
    base: `source`,
  })
      .pipe(gulp.dest(`build`));
});

gulp.task(`clean`, function () {
  return del(`build`);
});

gulp.task(`build`, gulp.series(
    `clean`,
    `copy`,
    `css`,
    `script`,
));

gulp.task(`start`, gulp.series(`build`, `server`));
