(() => {
  "use strict";

  module.exports = (gulp) => {

    const path = require("path");
    const plumber = require("gulp-plumber");
    const templateCache = require("gulp-angular-templatecache");

    const paths = [
      path.join(__dirname, "..", "src", "js", "**", "*.html"),
      path.join(__dirname, "..", "src", "partials", "*.html")
    ];

    gulp.task("templates", ["markdownviews"], () => {
      return gulp.src(paths)
        .pipe(plumber())
        .pipe(templateCache({
          module: "gubbins.templates",
          standalone: true,
          transformUrl: (url) => {
            if(url.indexOf("/") !== -1) {
              return url.split("/")[url.split("/").length - 1];
            } else if(url.indexOf("\\") !== -1) {
              return url.split("\\")[url.split("\\").length - 1];
            } else {
              return url;
            }
          }
        }))
        .pipe(gulp.dest(path.join(__dirname, "..", ".tmp")))
      ;
    });

  };

})();
