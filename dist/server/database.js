'use strict';

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

(function () {
  "use strict";

  var db = undefined;

  module.exports = {
    init: function init() {
      var conn = "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS + "@" + process.env.DBURL;
      MongoClient.connect(conn, function (err, _db) {
        if (!err) {
          console.log("DB Connection Successful");
          db = _db;
        } else {
          console.log(err, conn);
        }
      });
      return this;
    },
    addPass: function addPass(pass, cb, numberOfUses, hoursToLive, from) {
      var coll = db.collection("pass");
      var deathDate = new Date().getTime() + (hoursToLive || 24) * 1000 * 60 * 60;
      coll.insert({ pass: pass, numberOfUses: +numberOfUses || 1, from: from, deathDate: deathDate }, { w: 1 }, function (err, res) {
        console.log(res.ops[0]._id);
        cb(res.ops[0]._id);
      });
    },
    getPass: function getPass(id, cb) {
      var coll = db.collection("pass");
      coll.findOne({ _id: new ObjectID(id) }, function (err, doc) {
        if (err) {
          throw err;
        }
        if (doc == null) {
          cb(false);
        } else if (doc.deathDate < new Date().getTime()) {
          cb(false);
          coll.remove({ _id: ObjectID(id) }, true);
        } else if (doc.numberOfUses === 1) {
          cb(doc.pass);
          coll.remove({ _id: ObjectID(id) }, true);
        } else if (doc.numberOfUses > 1) {
          coll.update({ _id: ObjectID(id) }, { $inc: { numberOfUses: -1 } }, function (err, result) {
            if (err) {
              cb(false);
              console.log(err);
            } else {
              cb(doc.pass);
            }
          });
        } else {
          cb(false);
          coll.remove({ _id: ObjectID(id) }, true);
        }
      });
    }
  };
})();