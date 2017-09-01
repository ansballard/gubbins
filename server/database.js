const { MongoClient, ObjectID } = require("mongodb");
let db;

module.exports = {
  init() {
    let conn = process.env.LOCAL
      ? "mongodb://localhost/gubbins"
      : `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env
          .DBURL}`;
    MongoClient.connect(conn, (err, _db) => {
      if (!err) {
        db = _db;
      } else {
        throw err;
      }
    });
    return this;
  },
  addPass(pass, numberOfUses, hoursToLive, from) {
    const coll = db.collection("pass");
    pass = pass.length > 140 ? pass.substr(0, 140) : pass;
    from = from && from.length > 140 ? from.substr(0, 140) : from;
    let deathDate = new Date().getTime() + (hoursToLive || 24) * 1000 * 60 * 60;
    if (!isNaN(deathDate)) {
      return new Promise((resolve, reject) => {
        coll.insert(
          {
            pass: pass,
            numberOfUses: +numberOfUses || 1,
            from: from,
            deathDate: deathDate
          },
          { w: 1 },
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res.ops[0]._id);
            }
          }
        );
      });
    } else {
      return Promise.reject();
    }
  },
  getPass(id) {
    const coll = db.collection("pass");
    return new Promise((resolve, reject) => {
      coll.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        if (err) {
          reject(err);
        }
        if (doc == null) {
          resolve(false);
        } else if (doc.deathDate < new Date().getTime()) {
          resolve(false);
          coll.remove({ _id: ObjectID(id) }, true);
        } else if (doc.numberOfUses === 1) {
          resolve({
            pass: doc.pass,
            from: doc.from
          });
          coll.remove({ _id: ObjectID(id) }, true);
        } else if (doc.numberOfUses > 1) {
          coll.update(
            { _id: ObjectID(id) },
            { $inc: { numberOfUses: -1 } },
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  pass: doc.pass,
                  from: doc.from
                });
              }
            }
          );
        } else {
          resolve(false);
          coll.remove({ _id: ObjectID(id) }, true);
        }
      });
    });
  },
  validatePasses() {
    try {
      const coll = db.collection("pass");
      return Promise.resolve(
        coll.remove({
          $or: [
            { numberOfUses: { $lte: 0 } },
            { deathDate: { $lte: new Date().getTime() } },
            { deathDate: { $eq: "NaN" } }
          ]
        })
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
