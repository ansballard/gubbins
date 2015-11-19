(() => {
  "use strict";

  const gulp = require("gulp");
  const markdown = require("gulp-markdown");
  const wrapper = require("gulp-wrapper");
  const rename = require("gulp-rename");
  const babel = require("gulp-babel");
  const eslint = require("gulp-eslint");

  const header = require("./src/partials/header");
  const footer = require("./src/partials/footer");

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

  gulp.task("lint", () => {
    return gulp.src("./src/node/*.js")
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(gulp.dest("./dist/server/"))
    ;
  });

  gulp.task("node", ["lint"], () => {
    return gulp.src("./src/node/*.js")
      .pipe(babel())
      .pipe(gulp.dest("./dist/server/"))
    ;
  });

  gulp.task("default", ["markdownviews", "htmlviews", "node"]);

  gulp.task("watch", ["default"], () => {
    gulp.watch("./src/node/*.js", ["node"]);
    gulp.watch("./src/partials/*.md", ["markdownviews"]);
    gulp.watch("./src/partials/*.html", ["markdownhtml"]);
  });


})();
