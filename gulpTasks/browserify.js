(() => {
  "use strict";

  module.exports = (gulp) => {

    const util = require("gulp-util");
    const watchify = require("watchify");
    const babelify = require("babelify");
    const browserify = require("browserify");
    const source = require("vinyl-source-stream");
    const buffer = require("vinyl-buffer");

    const watchifyOpts = {
      entries: ["./src/js/app.js"],
      debug: true,
      cache: {},
      packageCache: {},
      transform: [babelify]
    };
    const bundleOpts = {
      entries: ["./src/js/app.js"],
      debug: true,
      transform: [babelify]
    };
    const w = watchify(browserify(watchifyOpts));
    const b = browserify(bundleOpts);

    gulp.task("bundle", () => {
      return bundle(b);
    });
    gulp.task("watchify", () => {
      return bundle(w);
    });
    w.on("update", () => {
      return bundle(w);
    });
    w.on("log", util.log);

    function bundle(stream) {
      return stream.bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .on("error", util.log.bind(util, "Browserify Error"))
        .pipe(gulp.dest("./dist/js/"))
      ;
    }

  };
})();
