const { task, series, src, dest, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer');
const csscomb = require('gulp-csscomb');
const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')

const PATH = {
  scssAllFiles:'./src/**/*.scss',
  cssFolder:'./assets/css',
  htmlAllFiles:'./**/*.html',
  jsAllFiles:'./src/**/*.js'
}

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true
  }),
  mqpacker({ sort: sortCSSmq })
]

function scss() {
  return src(PATH.scssAllFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS)) 
    .pipe(csscomb())
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream());
}

function scssMin() {
  const pluginsForMinify = [...PLUGINS, cssnano({ preset: 'default' })];
  return src(PATH.scssAllFiles, { sourcemaps: true })
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(pluginsForMinify))
  .pipe(rename({ suffix: '.min' }))
  .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
  .pipe(browserSync.stream());
}

function syncInit () {
  browserSync.init({
      server: {
          baseDir: './'
      }
  });
}
async function sync() {
  browserSync.reload()
}

function watchFiles() {
  syncInit()
  watch(PATH.scssAllFiles, scss)
  watch(PATH.scssAllFiles, sync)
  watch(PATH.htmlAllFiles, sync)
  watch(PATH.jsAllFiles, sync)
}

task('scss', scss)
task('min', scssMin)
task('watch', series(scss, scssMin, watchFiles))





