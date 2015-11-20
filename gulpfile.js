(() => {
  "use strict";

  const gulp = require("gulp");
  const markdown = require("gulp-markdown");
  const wrapper = require("gulp-wrapper");
  const rename = require("gulp-rename");
  const babel = require("gulp-babel");
  const uglify = require("gulp-uglify");
  const eslint = require("gulp-eslint");

  const watchify = require('watchify');
  const browserify = require('browserify');
  const source = require('vinyl-source-stream');
  const buffer = require('vinyl-buffer');

  const header = require("./src/partials/header");
  const footer = require("./src/partials/footer");

  require("./gulpTasks/browserify")(gulp);

  gulp.task("markdownviews", () => {
    return gulp.src("./*.md")
      .pipe(markdown())
      .pipe(wrapper({
        header: header,
        footer: footer
      }))
      .pipe(rename((path) => {
        path.extname = ".html"
      }))
      .pipe(gulp.dest("./views/"))
    ;
  });

  gulp.task("htmlviews", () => {
    return gulp.src("./src/partials/*.html")
      .pipe(wrapper({
        header: header,
        footer: footer
      }))
      .pipe(gulp.dest("./views/"))
    ;
  });

  gulp.task("lint:node", () => {
    return gulp.src("./src/node/*.js")
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(gulp.dest("./dist/server/"))
    ;
  });

  gulp.task("lint:js", () => {
    return gulp.src("./src/js/*.js")
      .pipe(eslint())
      .pipe(eslint.format())
    ;
  });

  gulp.task("lint", ["lint:node", "lint:js"]);

  gulp.task("babel:js", ["lint:js"], () => {
    return gulp.src("./src/js/*.js")
      .pipe(babel())
      .pipe(uglify())
      .pipe(gulp.dest("./dist/js/"))
    ;
  });

  gulp.task("babel:node", ["lint:node"], () => {
    return gulp.src("./src/node/*.js")
      .pipe(babel())
      .pipe(gulp.dest("./dist/server/"))
    ;
  });

  gulp.task("babel", ["babel:node", "babel:js"]);

  gulp.task("default", ["markdownviews", "htmlviews", "babel"]);

  gulp.task("watch", ["default"], () => {
    gulp.watch("./src/node/*.js", ["babel:node"]);
    gulp.watch("./src/js/*.js", ["babel:js"]);
    gulp.watch("./src/partials/*.md", ["markdownviews"]);
    gulp.watch("./src/partials/*.html", ["markdownhtml"]);
  });


})();
