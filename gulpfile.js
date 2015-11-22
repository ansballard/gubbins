(() => {
  "use strict";

  const gulp = require("gulp");
  const markdown = require("gulp-markdown");
  const wrapper = require("gulp-wrapper");
  const rename = require("gulp-rename");
  const babel = require("gulp-babel");
  const uglify = require("gulp-uglify");
  const sass = require("gulp-sass");
  const cssmin = require("gulp-minify-css");
  const concat = require("gulp-concat");
  const eslint = require("gulp-eslint");

  const watchify = require('watchify');
  const browserify = require('browserify');
  const source = require('vinyl-source-stream');
  const buffer = require('vinyl-buffer');

  const header = require("./src/partials/header");
  const footer = require("./src/partials/footer");

  require("./gulpTasks/browserify")(gulp);
  require("./gulpTasks/templates")(gulp);

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

  gulp.task("babel:node", ["lint:node"], () => {
    return gulp.src("./src/node/*.js")
      .pipe(babel())
      .pipe(gulp.dest("./dist/server/"))
    ;
  });

  gulp.task("sass", () => {
    return gulp.src("./src/scss/*.scss")
      .pipe(sass())
      //.pipe(cssmin())
      .pipe(concat("styles.css"))
      .pipe(gulp.dest("./dist/css/"))
    ;
  });

  gulp.task("default", ["markdownviews", "htmlviews", "babel:node", "sass"]);

  gulp.task("watch", ["default"], () => {
    gulp.watch("./src/node/*.js", ["babel:node"]);
    gulp.watch("./src/scss/*.scss", ["sass"]);
    gulp.watch("./src/js/**/*.html", ["templates"]);
    gulp.watch("./src/partials/*.js", ["markdownviews"]);
  });


})();
