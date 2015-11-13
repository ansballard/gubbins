"use strict";

(function () {
  "use strict";

  var encryption = require("./encryption");
  var markdown = require("./markdown");

  module.exports = function (app, database) {
    "use strict";

    app.get("/", function (req, res) {
      res.sendFile("gui.html", {
        root: app.get("views")
      }, function (err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
      });
    });

    app.get("/readme", function (req, res) {
      var fallback = "Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#readme'>Github</a> for instructions!";
      markdown("README").then(function (content) {
        res.send(content).end();
      }, function (err) {
        res.send(fallback).end();
      }).catch(function (e) {
        res.send(fallback).end();
      });
    });

    app.get("/changelog", function (req, res) {
      var fallback = "Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#changelog'>Github</a> for a full changelog and version information!";
      markdown("CHANGELOG").then(function (content) {
        res.send(content).end();
      }, function (err) {
        res.send(fallback).end();
      }).catch(function (e) {
        res.send(fallback).end();
      });
    });

    app.get("/api/generate/:content/", function (req, res) {
      encryption.keygen(function (key) {
        var enc = encryption.encrypt(req.params.content.toString("utf8"), key);
        database.addPass(enc).then(function (id) {
          res.send("https://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key).end();
        }, function (err) {
          res.status(500).end();
        }).catch(function (e) {
          res.status(500).end();
        });
      });
    });

    app.post("/api/generate/", function (req, res) {
      var key = undefined;
      encryption.keygen().then(function (_key) {
        key = _key;
        return encryption.encrypt(req.body.content.toString("utf8"), key);
      }).then(function (enc) {
        return database.addPass(enc, req.body.numberOfUses || undefined, req.body.hoursToLive || undefined, req.body.from || undefined);
      }).then(function (id) {
        res.send("https://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key).end();
      }, function (err) {
        res.status(500).end();
      }).catch(function (e) {
        res.status(500).end();
      });
    });

    app.get("/api/getpass/:id/:key", function (req, res) {
      database.getPass(req.params.id).then(function (pass) {
        if (!pass) {
          res.status(403).end();
        } else {
          encryption.decrypt(pass, req.params.key).then(function (plaintext) {
            res.send(plaintext).end();
          });
        }
      }, function (err) {
        res.status(500).end();
      }).catch(function (e) {
        res.status(500).end();
      });
    });
  };
})();