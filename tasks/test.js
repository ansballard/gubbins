/*(() => {
  "use strict";

  const gulp = require("gulp");
  const karma = require("karma").Server;

  gulp.task("test", ["buildSpecs"], (done) => {
    new karma({
      configFile: __dirname + "/../karma.conf.js",
      browsers: ["PhantomJS"],
      reporters: ["spec"],
      singleRun: true
    }, (e) => {
      done();
    }).start();
  });

})();
*/
