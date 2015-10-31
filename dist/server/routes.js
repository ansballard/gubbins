"use strict";

var encryption = require("./encryption");
var database = require("./database").init();

module.exports = function (app) {
	"use strict";

	app.get("/", function (req, res) {
		res.send("Welcome to Gubbins!");
		res.end();
	});

	app.get("/api/generate/:content/", function (req, res) {
		encryption.keygen(function (key) {
			var enc = encryption.encrypt(req.params.content.toString("utf8"), key);
			database.addPass(enc, function (id) {
				res.send("<a href='/api/getpass/" + id + "/" + key + "'>Link to Password</a>");
				res.end();
			});
		});
	});

	app.post("/api/generate/:content/", function (req, res) {
		encryption.keygen(function (key) {
			var enc = encryption.encrypt(req.params.content.toString("utf8"), key);
			database.addPass(enc, function (id) {
				res.send("<a href='/api/getpass/" + id + "/" + key + "'>Link to Password</a>");
				res.end();
			}, req.params.numberOfUses || undefined, req.params.hoursToLive || undefined);
		});
	});

	app.get("/api/getpass/:id/:key", function (req, res) {
		database.getPass(req.params.id, function (pass) {
			if (!pass) {
				res.send("No password for you!");
			} else {
				res.send(encryption.decrypt(pass, req.params.key));
			}
			//res.end();
		});
	});
};