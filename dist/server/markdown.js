"use strict";

(function () {

	var md = require("marked");
	var fs = require("fs");
	var path = require("path");

	var header = "\n\t\t<!DOCTYPE html>\n\t\t<html>\n\t\t<head>\n\t\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>\n\t\t  <meta charset=\"UTF-8\">\n\t\t  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\t\t\t<title>Gubbins</title>\n\t\t\t<link\n\t\t\t\trel=\"stylesheet\"\n\t\t\t\thref=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css\"\n\t\t\t\tintegrity=\"sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==\"\n\t\t\t\tcrossorigin=\"anonymous\"\n\t\t\t>\n\t\t</head>\n\t\t<body>\n\t\t\t<div class=\"page-header\">\n\t\t\t\t<h1>Gubbins\n\t\t\t\t\t<small>Documentation</small>\n\t\t\t\t</h1>\n\t\t\t</div>\n\t\t\t<div class=\"col-xs-12 col-sm-6\">\n\t";
	var footer = "\n\t\t\t</div>\n\t\t\t<div class=\"col-xs-12 col-sm-6\">\n\t\t\t\t<ul class=\"col-xs-10 nav nav-pills nav-stacked\">\n\t\t\t\t\t<li role=\"presentation\"><a href=\"/\">Generator</a></li>\n\t\t\t\t\t<li role=\"presentation\"><a href=\"/readme\">Readme</a></li>\n\t\t\t\t\t<li role=\"presentation\"><a href=\"/changelog\">Changelog</a></li>\n\t\t\t\t\t<li role=\"presentation\"><a href=\"https://github.com/ansballard/gubbins\">Repo</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t</div>\n\t\t</body>\n\t\t</html>\n\t";

	module.exports = function (filename) {
		var deferred = require("q").defer();
		fs.readFile(path.join(__dirname, "..", "..", filename + ".md"), "utf8", function (err, parsed) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(buildPage(md(parsed.toString())));
			}
		});
		return deferred.promise;
	};

	function buildPage(content) {
		return [header, content, footer].join("");
	}
})();