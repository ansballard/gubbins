"use strict";

(function () {

  var q = require("q");

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
      res.redirect("#/readme");
    });

    app.get("/changelog", function (req, res) {
      res.redirect("#/changelog");
    });

    app.get("/gub/:id/:key", function (req, res) {
      getGub(req).then(function (gub) {
        res.status(gub.status);
        res.render("gub", {
          status: gub.status,
          pass: gub.content || "",
          from: gub.from || ""
        });
      }, function (passRes) {
        res.status(500);
        res.render("gub", {
          status: 500,
          pass: "",
          from: ""
        });
      });
    });

    app.get("/api/generate/:content/", function (req, res) {
      encryption.keygen(function (key) {
        var enc = encryption.encrypt(req.params.content.toString("utf8"), key);
        database.addPass(enc).then(function (id) {
          res.send("https://gubbins-ansballard.rhcloud.com/gub/" + id + "/" + key).end();
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
        res.send("https://gubbins-ansballard.rhcloud.com/gub/" + id + "/" + key).end();
      }, function (err) {
        res.status(500).end();
      }).catch(function (e) {
        res.status(500).end();
      });
    });

    app.get("/api/getgub/:id/:key", function (req, res) {
      getGub(req).then(function (passResponse) {
        if (passResponse.status === 200) {
          res.send(passResponse.content).end();
        } else {
          res.status(passResponse.status).end();
        }
      });
    });

    function getGub(req) {
      var deferred = q.defer();
      console.log("start getGub");
      database.getPass(req.params.id).then(function (gub) {
        if (!gub) {
          console.log("wrongGub");
          deferred.resolve({ status: 403 });
        } else {
          console.log("gotGub");
          console.log(gub);
          encryption.decrypt(gub.pass, req.params.key).then(function (plaintext) {
            console.log("decryptedGub");
            deferred.resolve({
              status: 200,
              content: plaintext,
              from: gub.from
            });
          });
        }
      }, function (err) {
        deferred.resolve({ status: 500 });
      }).catch(function (e) {
        console.log("brokeGub");
        console.log(e);
        deferred.reject({ status: 500 });
      });
      return deferred.promise;
    }
  };
})();