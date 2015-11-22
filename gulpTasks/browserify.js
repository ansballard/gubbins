(() => {
  "use strict";

  module.exports = (gulp) => {

    const argv = require("yargs").argv;
    const util = require("gulp-util");
    const uglify = require("gulp-uglify");
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

    gulp.task("bundle", ["templates"], () => {
      return bundle(b);
    });
    gulp.task("watchify", ["templates"], () => {
      return bundle(w);
    });
    w.on("update", () => {
      return bundle(w);
    });
    w.on("log", util.log);

    function bundle(stream) {
      const bundledFile = stream.bundle()
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .on("error", util.log.bind(util, "Browserify Error"))
      ;
      if(typeof argv.prod !== "undefined") {
        bundledFile.pipe(uglify());
      }
      return bundledFile.pipe(gulp.dest("./dist/js/"));
    }

  };
})();
