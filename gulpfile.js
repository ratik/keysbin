var gulp = require("gulp"),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    nodemon = require("gulp-nodemon");


gulp.task("webpack:main", function(callback) {
    webpack(require('./webpack.main.config.js'), function(err, stats) {
        callback();
    });
});

// gulp.task("webpack:openpgp", function(callback) {
//     webpack(require('./webpack.openpgp.config.js'), function(err, stats) {
//         callback();
//     });
// });
// gulp.task("webpack:openpgp:worker", function(callback) {
//     webpack(require('./webpack.openpgp.worker.config.js'), function(err, stats) {
//         console.log(err);
//         console.log(stats);
//         callback();
//     });
// });


gulp.task('dev', function () {
  nodemon({ script: 'index.js', ext: 'js', path:['models','controllers'] })
    .on('restart', function () {
      console.log('restarted!')
    })
})

gulp.task("openpgp", function(callback) {
    gulp.src('./bower_components/openpgp/dist/*.min.js').
        pipe(gulp.dest('./public/js'));
});

