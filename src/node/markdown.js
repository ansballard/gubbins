(() => {

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
			<link
				rel="stylesheet"
				href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
				integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ=="
				crossorigin="anonymous"
			>
		</head>
		<body>
			<div class="page-header">
				<h1>Gubbins
					<small>Documentation</small>
				</h1>
			</div>
			<div class="col-xs-12 col-sm-6">
	`;
  const footer = `
			</div>
			<div class="col-xs-12 col-sm-6">
				<ul class="col-xs-10 nav nav-pills nav-stacked">
					<li role="presentation"><a href="/">Generator</a></li>
					<li role="presentation"><a href="/readme">Readme</a></li>
					<li role="presentation"><a href="/changelog">Changelog</a></li>
					<li role="presentation"><a href="https://github.com/ansballard/gubbins">Repo</a></li>
				</ul>
			</div>
			</div>
		</body>
		</html>
	`;

  module.exports = function(filename) {
    const deferred = require("q").defer();
    fs.readFile(path.join(__dirname, "..", "..", (filename + ".md")), "utf8", (err, parsed) => {
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
