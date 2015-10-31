const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

(() => {
  "use strict";

  let db;

  module.exports = {
    init() {
      let conn = "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS + "@" + process.env.DBURL;
      MongoClient.connect(conn, (err, _db) => {
        if (!err) {
          console.log("We are connected");
          db = _db;
        } else {
          console.log(err, conn);
        }
      });
      return this;
    },
    addPass(pass, cb, numberOfUses, hoursToLive) {
      const coll = db.collection("pass");
      let deathDate = new Date().getTime() + (hoursToLive || 24) * 1000 * 60 * 60;
      coll.insert({ pass: pass, numberOfUses: numberOfUses || 1, deathDate: deathDate }, { w: 1 }, function (err, res) {
        console.log(res.ops[0]._id);
        cb(res.ops[0]._id);
      });
    },
    getPass(id, cb) {
      const coll = db.collection("pass");
      coll.findOne({ _id: new ObjectID(id) }, function (err, doc) {
        if (err) {
          throw err;
        }
        if (doc == null) {
          console.log("Doesn't Exist");
          cb(false);
        } else if (doc.deathDate < new Date().getTime()) {
          console.log("expired");
          coll.remove({ _id: ObjectID(id) }, true);
          cb(false);
        } else if (doc.numberOfUses === 1) {
          cb(doc.pass);
          console.log("Last Use");
          coll.remove({ _id: ObjectID(id) }, true);
        } else if (doc.numberOfUses > 1) {
          console.log("More Uses");
          coll.update({ _id: ObjectID(id) }, { $inc: { numberOfUses: -1 } });
          cb(doc.pass);
        } else {
          console.log("Remove");
          coll.remove({ _id: ObjectID(id) }, true);
          cb(false);
        }
      });
    }
  };
})();