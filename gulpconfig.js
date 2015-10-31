(function () {
  "use strict";

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

  var deploy = {

  };

  module.exports = {
    dist: dist,
    src: src,
    srcFolder: srcFolder,
    deploy: deploy,
    main: dist.node + "app.js"
  };

})();
