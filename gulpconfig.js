(function () {
  "use strict";

  var argv = require("yargs").argv;

  var distFolder = "./dist/";
  var srcFolder = {
    "main": "./src/",
    "node": "./src/node/"
  };

  var dist = {
    "main": distFolder,
    "specs": "./tmp/specs/",
    "node": distFolder + "server/"
  };

  var src = {
    "specs": srcFolder.js + "**/_tests/*Spec.js",
    "node": [
      srcFolder.node + "*.js"
    ]
  };

  let deploy = {

  };

  module.exports = {
    dist: dist,
    src: src,
    srcFolder: srcFolder,
    deploy: deploy,
    main: dist.node + "app.js"
  };

})();
