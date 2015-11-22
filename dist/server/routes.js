"use strict";

(function () {

  var encryption = require("./encryption");

  module.exports = function (app, database) {
    "use strict";

    app.get("/", function (req, res) {
      res.sendFile("index.html", {
        root: app.get("views")
      }, function (err) {
        if (err) {
          res.status(err.status).end();
        }
      });
    });

    app.get("/readme", function (req, res) {
      res.sendFile("README.html", {
        root: app.get("views")
      }, function (err) {
        if (err) {
          res.status(err.status).end();
        }
      });
    });

    app.get("/changelog", function (req, res) {
      res.sendFile("CHANGELOG.html", {
        root: app.get("views")
      }, function (err) {
        if (err) {
          res.status(err.status).end();
        }
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