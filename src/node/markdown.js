(() => {
	"use strict";

	const md = require("marked");
	const fs = require("fs");
	const path = require("path");

	const header = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1">
			<title>Gubbins</title>
		</head>
		<body>
	`;
	const footer = `
		</body>
		</html>
	`;

	module.exports = function(filename) {
		"use strict";

		const deferred = require("q").defer();

	  fs.readFile(path.join(__dirname, "..", "..", (filename + ".md")), "utf8", (err, parsed) => {
	    if(err) {
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
