'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var mcss = require('gulp_mcss');
var sprity = require('sprity');
var ejs = require("gulp-ejs")
var gutil = require('gulp-util')
var lang = require('./scripts/lang');


var count = 0;

gulp.task('mcss', function(){
    return gulp.src(['src/mcss/*.mcss', '!src/mcss/_*.mcss'])
        .pipe(mcss({
            format: 2,
            // importCSS: true,
            // pathes: ['src/javascript/lib']
        }))
        .pipe(gulp.dest('resource/assets/css'));
});

gulp.task('mcssWatch', function() {
    gulp.watch('src/mcss/*.mcss', ['mcss']);
});

gulp.task('watch', ['mcssWatch', 'webpackWatch']);

gulp.task('sprite', function () {
    return sprity.src({
        src: 'resource/assets/img/sprite/*.{png,jpg}',
        cssPath: '/assets/img/',
        style: 'resource/assets/css/sprite.css',
        prefix: 'icon-sprite'
        // margin: 0
    })
    .pipe(gulpif('*.png', gulp.dest('resource/assets/img/'), gulp.dest('resource/assets/css/')))
});

gulp.task('ejs', function () {
    gulp.src(["src/templates/**/*.ejs", "!src/templates/**/_*.ejs"])
    .pipe(ejs(lang,{},{ext: '.html'}))
    .on('error', gutil.log)
    .pipe(gulp.dest("./resource"));
});

gulp.task('ejsWatch', function() {
    gulp.watch('src/templates/**/*.ejs', ['ejs']);
});



gulp.task('default', ['mcssWatch', 'ejsWatch', 'mcss', 'ejs']);





