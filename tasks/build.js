(() => {
  "use strict";

  const gulp = require("gulp");
  const plumber = require("gulp-plumber");
  const source = require("vinyl-source-stream");
  const buffer = require("vinyl-buffer");
  const globby = require("globby");
  const browserify = require("browserify");
  const babelify = require("babelify");
  const babel = require("gulp-babel");

  const config = require("../gulpconfig");

  gulp.task("buildSpecs", ["cleanSpecs"], () => {

    return browserify({
        entries: globby.sync(config.src.specs),
        debug: true,
        transform: [babelify]
      }).bundle()
      .pipe(source('specs.min.js'))
      .pipe(buffer())
      .pipe(gulp.dest(config.dist.specs));
  });

  gulp.task("buildNode", ["cleanNode"], () => {
    return gulp.src(config.src.node)
      .pipe(plumber())
      .pipe(babel())
      .pipe(gulp.dest(config.dist.node));
  });

  gulp.task("build", ["buildNode"]);

})();
