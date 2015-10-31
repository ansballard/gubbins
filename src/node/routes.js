const encryption = require("./encryption");
const database = require("./database").init();
const md = require("marked");
const fs = require("fs");
const path = require("path");

module.exports = function(app) { "use strict";

	app.get("/", (req, res) => {
		fs.readFile(path.join(__dirname, "..", "..", "README.md"), "utf8", (err, parsed) => {
			if(err) {
				res.send("Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#readme'>Github</a> for instructions!");
			} else {
				res.send(md(parsed.toString()));
			}
			res.end();
		});
	});

	app.get("/changelog", (req, res) => {
		fs.readFile(path.join(__dirname, "..", "..", "CHANGELOG.md"), "utf8", (err, parsed) => {
			if(err) {
				res.send("Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#changelog'>Github</a> for a full changelog and version information!");
			} else {
				res.send(md(parsed.toString()));
			}
			res.end();
		});
	});

	app.get("/api/generate/:content/", (req, res) => {
		encryption.keygen((key) => {
			let enc = encryption.encrypt(req.params.content.toString("utf8"), key);
			database.addPass(enc, (id) => {
				res.send("http://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key);
				res.end();
			});
		});
	});

	app.post("/api/generate/:content/", (req, res) => {
		encryption.keygen((key) => {
			let enc = encryption.encrypt(req.params.content.toString("utf8"), key);
			database.addPass(enc,
				(id) => {
					res.send("http://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key);
					res.end();
				},
				req.params.numberOfUses || undefined,
				req.params.hoursToLive || undefined,
				req.params.from || undefined
			);
		});
	});

	app.get("/api/getpass/:id/:key", (req, res) => {
		database.getPass(req.params.id, (pass) => {
			if(!pass) {
				res.sendStatus(403);
			} else {
				res.send(encryption.decrypt(pass, req.params.key));
				res.end();
			}
		});
	});
};
