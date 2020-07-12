'use strict';

const gulp = require('gulp');

const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
//const cheerio = require('gulp-cheerio')
const replace = require('gulp-replace');

const
sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-cleancss');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const babel = require("gulp-babel");
const babelify = require('babelify');

const rename = require('gulp-rename');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const spritesmith = require('gulp.spritesmith');

const config = {
    mode: {
        symbol: {
            sprite: "sprite.svg",
        }
    }
};

const paths = {
    src: './src/',              // paths.src
    build: './build/'           // paths.build
};

function styles() {
    return gulp.src(paths.src + 'scss/main.scss')
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass()) // { outputStyle: 'compressed' }
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest(paths.build + 'css/'))
}

function scripts() {
    return (
        browserify(paths.src + 'js/main.js')
            .transform("babelify", {presets: ["@babel/preset-env"]})
            .bundle()
            .pipe(source("bundle.js"))
            // Turn it into a buffer!
            .pipe(buffer())
            // And uglify
            .pipe(uglify())
            .pipe(gulp.dest(paths.build + 'js/'))
    )
}

function spritesPng() {
    const spriteData = gulp.src(paths.src + 'img/iconsSprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        padding: 25
    }));
    return spriteData.pipe(gulp.dest(paths.build + 'icons'));
}

function htmls() {
    return gulp.src(paths.src + '*.html')
        .pipe(plumber())
        .pipe(gulp.dest(paths.build));
}

function img() {
    return gulp.src(paths.src + 'img/*')
        .pipe(gulp.dest(paths.build + 'img'));
}

function favicon() {
    return gulp.src(paths.src + 'favicon/*')
        .pipe(gulp.dest(paths.build + 'favicon'));
}

function fonts() {
    return gulp.src(paths.src + 'fonts/**/*')
        .pipe(gulp.dest(paths.build + 'fonts'));
}

function clean() {
    return del('build/')
}

function watch() {
    gulp.watch(paths.src + 'scss/**/*.scss', styles);
    gulp.watch(paths.src + 'js/*.js', scripts);
    gulp.watch(paths.src + '*.html', htmls);
    gulp.watch(paths.src + 'img/*', img);
}

function serve() {
    browserSync.init({
        server: {
            baseDir: paths.build
        }
    });
    browserSync.watch(paths.build + '**/*.*', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.htmls = htmls;
exports.clean = clean;
exports.watch = watch;
exports.img = img;
exports.favicon = favicon;
exports.fonts = fonts;
exports.spritesPng = spritesPng;

gulp.task('build', gulp.series(
    clean,
    styles,
    scripts,
    htmls,
    img,
    fonts,
    favicon,
    spritesPng
    // gulp.parallel(styles, scripts, htmls, img, fonts)
));

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, scripts, htmls, img, fonts, favicon, spritesPng),
    gulp.parallel(watch, serve)
));
