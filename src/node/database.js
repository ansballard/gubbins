const MongoClient = require('mongodb').MongoClient;

(() => {
  "use strict";

  let db;

  module.exports = {
    init() {
      let conn = "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS + "@ds048878.mongolab.com:48878/gubbins";
      MongoClient.connect(conn, (err, _db) => {
        if(!err) {
          console.log("We are connected");
          db = _db;
        } else {
          console.log(err, conn);
        }
      });
      return this;
    },
    addPass(pass, cb) {
      const coll = db.collection("pass");
      coll.insert({pass: pass, valid: true}, {w:1}, function(err, res) {
        console.log(res.ops[0]._id);
        cb(res.ops[0]._id);
      });
    },
    getPass(id, cb) {
      const coll = db.collection("pass");
      coll.update({_id: id}, {$set: {valid: false}}, {w:1}, function(err, res) {
        cb(res);
      });
    }
  }

})();
