"use strict";

var encryption = require("./encryption");
var markdown = require("./markdown");
var database = require("./database").init();

module.exports = function (app) {
	"use strict";

	app.get("/", function (req, res) {
		res.sendFile("gui.html", { root: app.get("views") }, function (err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			}
		});
	});

	app.get("/readme", function (req, res) {
		markdown("README", function (content, err) {
			if (err) {
				res.send("Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#readme'>Github</a> for instructions!");
			} else {
				res.send(content);
			}
			res.end();
		});
	});

	app.get("/changelog", function (req, res) {
		markdown("CHANGELOG", function (content, err) {
			if (err) {
				res.send("Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#changelog'>Github</a> for a full changelog and version information!");
			} else {
				res.send(content);
			}
			res.end();
		});
	});

	app.get("/api/generate/:content/", function (req, res) {
		encryption.keygen(function (key) {
			var enc = encryption.encrypt(req.params.content.toString("utf8"), key);
			database.addPass(enc, function (id) {
				res.send("http://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key);
				res.end();
			});
		});
	});

	app.post("/api/generate/", function (req, res) {
		encryption.keygen(function (key) {
			var enc = encryption.encrypt(req.body.content.toString("utf8"), key);
			database.addPass(enc, function (id) {
				res.send("http://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key);
				res.end();
			}, req.body.numberOfUses || undefined, req.body.hoursToLive || undefined, req.body.from || undefined);
		});
	});

	app.get("/api/getpass/:id/:key", function (req, res) {
		database.getPass(req.params.id, function (pass) {
			if (!pass) {
				res.sendStatus(403);
			} else {
				res.send(encryption.decrypt(pass, req.params.key));
				res.end();
			}
		});
	});
};