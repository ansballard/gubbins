/*eslint-env node*/
const argv = require("yargs").argv;
const gulp = require("gulp");
const markdown = require("gulp-markdown");
const wrapper = require("gulp-wrapper");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const cssmin = require("gulp-minify-css");
const concat = require("gulp-concat");
const eslint = require("gulp-eslint");

const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

require("./gulpTasks/browserify")(gulp);
require("./gulpTasks/templates")(gulp);

gulp.task("markdownviews", () => {
  return gulp.src("./*.md")
    .pipe(markdown())
    .pipe(rename((path) => {
      path.extname = ".template.html",
      path.basename = path.basename.toLowerCase()
    }))
    .pipe(gulp.dest("./src/partials/"))
  ;
});

gulp.task("lint:node", () => {
  return gulp.src("./src/node/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest("./dist/server/"))
  ;
});

gulp.task("css", () => {
  const cssStream = gulp.src("./src/css/*.css");
  if(typeof argv.prod !== "undefined") {
    cssStream.pipe(cssmin());
  }
  return cssStream.pipe(cssmin())
    .pipe(concat("styles.css"))
    .pipe(gulp.dest("./dist/css/"))
  ;
});

gulp.task("default", ["markdownviews", "css", "bundle"]);

gulp.task("watch", ["default"], () => {
  gulp.watch("./src/css/*.css", ["css"]);
  gulp.watch(["./src/js/**/*.html", "./src/partials/*.html"], ["templates"]);
  gulp.watch("./src/partials/*.js", ["markdownviews"]);
});
