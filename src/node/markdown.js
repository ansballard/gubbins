(() => {
	"use strict";

	const md = require("marked");
	const fs = require("fs");
	const path = require("path");

	module.exports = function(filename) {
		"use strict";

		const deferred = require("q").defer();

	  fs.readFile(path.join(__dirname, "..", "..", (filename + ".md")), "utf8", (err, parsed) => {
	    if(err) {
				deferred.reject(e);
	    } else {
				deferred.resolve(md(parsed.toString()));
	    }
	  });

		return deferred.promise;

	};
})();
