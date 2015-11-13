"use strict";

(function () {
	"use strict";

	var md = require("marked");
	var fs = require("fs");
	var path = require("path");

	var header = "\n\t\t<!DOCTYPE html>\n\t\t<html>\n\t\t<head>\n\t\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>\n\t\t  <meta charset=\"UTF-8\">\n\t\t  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\t\t\t<title>Gubbins</title>\n\t\t</head>\n\t\t<body>\n\t";
	var footer = "\n\t\t</body>\n\t\t</html>\n\t";

	module.exports = function (filename) {
		"use strict";

		var deferred = require("q").defer();

		fs.readFile(path.join(__dirname, "..", "..", filename + ".md"), "utf8", function (err, parsed) {
			if (err) {
				deferred.reject(e);
			} else {
				deferred.resolve(buildPage(md(parsed.toString())));
			}
		});

		return deferred.promise;
	};

	function buildPage(content) {
		return header + content + footer;
	}
})();