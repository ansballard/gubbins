"use strict";

var md = require("marked");
var fs = require("fs");
var path = require("path");

module.exports = function (filename, cb) {
  "use strict";

  fs.readFile(path.join(__dirname, "..", "..", filename + ".md"), "utf8", function (err, parsed) {
    if (err) {
      cb(false, err);
    } else {
      cb(md(parsed.toString()));
    }
  });
};