/**
 * Gulp file 
 * $ gulp build
 */

const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
//js
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Configuration file to keep your code DRY
var cfg = require('./gulpconfig.json');
var paths = cfg.paths;


/**
 * clean up day
 */
function cleanTask(cb) {
    console.log('Clean up day !');
    cb()
}

/**
 * Compile sass
 */
function sassTask() {
    return src(paths.sass + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.css))

}

/**
 * Minify css
 */
function sassMinifyTask() {
    return src(paths.css + '/theme.css')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.css))
     .pipe(browserSync.stream())
}

/**
 * Compile javascript
 */
function jsTask() {
    var scripts = [

        paths.node + '/jquery/dist/jquery.js',
        paths.node + '/popper.js/dist/umd/popper.js',
        paths.node + '/bootstrap/dist/js/bootstrap.js',

        // Adding currently empty javascript file to add on for your own themes´ customizations
        // Please add any customizations to this .js file only!
        paths.dev + '/custom-javascript.js',
    ];

    src(scripts, { allowEmpty: true })
        .pipe(babel())
        .pipe(concat('theme.min.js'))
        .pipe(uglify())
        .pipe(dest(paths.js));
    return src(scripts, { allowEmpty: true })
        .pipe(babel())
        .pipe(concat('theme.js'))
        .pipe(dest(paths.js));

}


/**
 * Minify css
 */
function jsMinfyTask(cb) {
    console.log('minifycss')
    cb()
}
/**
 * 
 */
function stylesTask(cb) {
    series(sassTask, sassMinifyTask)(cb)
}
/**
 * watch 
 */
function watchTask() {
    watch(`${paths.sass}/**/*.scss`, series(stylesTask));

    watch(`${paths.dev}/**/*.js`, series(jsTask));
}

/**
 * Starts browser-sync task for starting the server.
 */
function browserSyncTask() {
    browserSync.init(cfg.browserSyncWatchFiles, cfg.browserSyncOptions);
}
/**
 * export build
 */
exports.compile = series(jsTask, stylesTask);
exports.watch = parallel(watchTask, browserSyncTask);