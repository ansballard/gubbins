const encryption = require("./encryption");
const database = require("./database").init();

module.exports = function (app) {
	"use strict";

	app.get("/", (req, res) => {
		res.send("Welcome to Gubbins!");
		res.end();
	});

	app.get("/api/generate/:content/", (req, res) => {
		encryption.keygen(key => {
			let enc = encryption.encrypt(req.params.content.toString("utf8"), key);
			database.addPass(enc, id => {
				res.send("<a href='/api/getpass/" + id + "/" + key + "'>Link to Password</a>");
				res.end();
			});
		});
	});

	app.post("/api/generate/:content/", (req, res) => {
		encryption.keygen(key => {
			let enc = encryption.encrypt(req.params.content.toString("utf8"), key);
			database.addPass(enc, id => {
				res.send("<a href='/api/getpass/" + id + "/" + key + "'>Link to Password</a>");
				res.end();
			}, req.params.numberOfUses || undefined, req.params.hoursToLive || undefined);
		});
	});

	app.get("/api/getpass/:id/:key", (req, res) => {
		database.getPass(req.params.id, pass => {
			if (!pass) {
				res.send("No password for you!");
			} else {
				res.send(encryption.decrypt(pass, req.params.key));
			}
			//res.end();
		});
	});
};