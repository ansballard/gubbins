"use strict";

(function () {
	"use strict";

	var md = require("marked");
	var fs = require("fs");
	var path = require("path");

	module.exports = function (filename) {
		"use strict";

		var deferred = require("q").defer();

		fs.readFile(path.join(__dirname, "..", "..", filename + ".md"), "utf8", function (err, parsed) {
			if (err) {
				deferred.reject(e);
			} else {
				deferred.resolve(md(parsed.toString()));
			}
		});

		return deferred.promise;
	};
})();