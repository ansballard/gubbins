const md = require("marked");
const fs = require("fs");
const path = require("path");

module.exports = function(filename, cb) {
	"use strict";

  fs.readFile(path.join(__dirname, "..", "..", (filename + ".md")), "utf8", (err, parsed) => {
    if(err) {
      cb(false, err)
    } else {
      cb(md(parsed.toString()));
    }
  });

};
