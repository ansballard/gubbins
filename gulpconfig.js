(() => {
  "use strict";

  const argv = require("yargs").argv;

  const distFolder = "./dist/";
  const srcFolder = {
    "main": "./src/",
    "node": "./src/node/"
  };

  let dist = {
    "main": distFolder,
    "specs": "./tmp/specs/",
    "node": distFolder + "server/"
  };

  let src = {
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
