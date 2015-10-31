(() => {
  "use strict";

  const gulp = require("gulp");
  const del = require("del");

  const config = require("../gulpconfig");

  /*gulp.task("cleanSpecs", () => {
    return del([config.dist.specs]);
  });*/

  gulp.task("cleanNode", () => {
    return del(config.dist.node + "main.js");
  });

})();
