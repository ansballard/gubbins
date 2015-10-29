(() => {
  "use strict";


  const gulp = require("gulp");

  const config = require("./gulpconfig");

  const requireDir = require("require-dir");

  requireDir("./tasks");

  gulp.task("default", ["buildNode"]);

  gulp.task("watch", ["default"], () => {

    gulp.watch(config.src.node, ["buildNode"]);
  });

  module.exports = () => {
    gulp.run("default");
  };

})();
