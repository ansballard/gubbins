(() => {
  "use strict";

  const encryption = require("./encryption");
  const markdown = require("./markdown");

  module.exports = function(app, database) {
    "use strict";

    app.get("/", (req, res) => {
      res.sendFile("gui.html", {
        root: app.get("views")
      }, function(err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
      })
    });

    app.get("/readme", (req, res) => {
      const fallback = "Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#readme'>Github</a> for instructions!";
      markdown("README").then(
        (content) => {
          res.send(content).end();
        }, (err) => {
          res.send(fallback).end();
        }).catch((e) => {
          res.send(fallback).end();
        })
      ;
    });

    app.get("/changelog", (req, res) => {
      const fallback = "Welcome to Gubbins! See <a href='http://github.com/ansballard/gubbins#changelog'>Github</a> for a full changelog and version information!";
      markdown("CHANGELOG").then(
        (content) => {
          res.send(content).end();
        }, (err) => {
          res.send(fallback).end();
        }).catch((e) => {
          res.send(fallback).end();
        })
      ;
    });

    app.get("/api/generate/:content/", (req, res) => {
      encryption.keygen((key) => {
        let enc = encryption.encrypt(req.params.content.toString("utf8"), key);
        database.addPass(enc).then((id) => {
            res.send("http://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key).end();
          }, (err) => {
            res.status(500).end();
          })
          .catch((e) => {
            res.status(500).end();
          })
        ;
      });
    });

    app.post("/api/generate/", (req, res) => {
      let key;
      encryption.keygen().then((_key) => {
          key = _key;
          return encryption.encrypt(req.body.content.toString("utf8"), key);
        }).then((enc) => {
          return database.addPass(enc,
            req.body.numberOfUses || undefined,
            req.body.hoursToLive || undefined,
            req.body.from || undefined
          );
        }).then((id) => {
          res.send("http://gubbins-ansballard.rhcloud.com/api/getpass/" + id + "/" + key).end();
        }, (err) => {
          res.status(500).end();
        })
        .catch((e) => {
          res.status(500).end();
        })
      ;
    });

    app.get("/api/getpass/:id/:key", (req, res) => {
      database.getPass(req.params.id).then((pass) => {
          if (!pass) {
            res.status(403).end();
          } else {
            encryption.decrypt(pass, req.params.key).then((plaintext) => {
              res.send(plaintext).end();
            });
          }
        }, (err) => {
          res.status(500).end();
        })
        .catch((e) => {
          res.status(500).end();
        })
      ;
    });
  };

})();
