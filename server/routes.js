const encryption = require("./encryption");

module.exports = (app, database) => {
  app.get("/", (req, res) => {
    res.sendFile(
      "index.html",
      {
        root: app.get("views")
      },
      err => {
        if (err) {
          res.status(err.status).end();
        }
      }
    );
  });

  app.get("/readme", (req, res) => {
    res.redirect("/#!/readme");
  });

  app.get("/changelog", (req, res) => {
    res.redirect("/#!/changelog");
  });

  app.get("/gub/:id/:key", (req, res) => {
    getGub(req).then(
      gub => {
        res.status(gub.status);
        res.render("gub", {
          status: gub.status,
          pass: gub.content || "",
          from: gub.from || ""
        });
      },
      passRes => {
        res.status(500);
        res.render("gub", {
          status: 500,
          pass: "",
          from: ""
        });
      }
    );
  });

  app.get("/api/generate/:content/", (req, res) => {
    encryption.keygen(key => {
      let enc = encryption.encrypt(req.params.content.toString("utf8"), key);
      database
        .addPass(enc)
        .then(
          id => {
            res
              .send(
                `${req.headers.host}/gub/${id}/${key}`
                // "https://gubbins-ansballard.rhcloud.com/gub/" + id + "/" + key
              )
              .end();
          },
          err => {
            res.status(500).end();
          }
        )
        .catch(e => {
          res.status(500).end();
        });
    });
  });

  app.post("/api/generate/", (req, res) => {
    let key;
    encryption
      .keygen()
      .then(_key => {
        key = _key;
        return encryption.encrypt(req.body.content.toString("utf8"), key);
      })
      .then(enc => {
        return database.addPass(
          enc,
          req.body.numberOfUses || undefined,
          req.body.hoursToLive || undefined,
          req.body.from || undefined
        );
      })
      .then(
        id => {
          res.send(`${req.headers.host}/gub/${id}/${key}`).end();
        },
        err => {
          res.status(500).end();
        }
      )
      .catch(e => {
        res.status(500).end();
      });
  });

  app.get("/api/getgub/:id/:key", (req, res) => {
    getGub(req).then(passResponse => {
      if (passResponse.status === 200) {
        res.send(passResponse.content).end();
      } else {
        res.status(passResponse.status).end();
      }
    });
  });

  function getGub(req) {
    return new Promise((resolve, reject) => {
      database
        .getPass(req.params.id)
        .then(
          gub => {
            if (!gub) {
              resolve({ status: 403 });
            } else {
              encryption.decrypt(gub.pass, req.params.key).then(plaintext => {
                resolve({
                  status: 200,
                  content: plaintext,
                  from: gub.from
                });
              });
            }
          },
          err => {
            resolve({ status: 500 });
          }
        )
        .catch(e => {
          reject({ status: 500 });
        });
    });
  }
};
