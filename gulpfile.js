var gulp = require("gulp"),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    nodemon = require("gulp-nodemon");

gulp.task("source", ['openpgp'], function(callback) {
    webpack(require('./webpack.config.js'), function(err, stats) {
        callback();
    });
});

gulp.task("default", ['openpgp'], function(callback) {
    var cfg = require('./webpack.config.js');
    cfg.plugins.push(new webpack.optimize.UglifyJsPlugin());
    webpack(cfg, function(err, stats) {
        callback();
    });
});

gulp.task('dev', function() {
    nodemon({
            script: 'index.js',
            ext: 'js',
            path: ['models', 'controllers']
        })
        .on('restart', function() {
            console.log('restarted!')
        });
});

gulp.task("openpgp", [], function(callback) {
    return gulp.src('./bower_components/openpgp/dist/*.min.js')
        .pipe(gulp.dest('./public/js'));
});
