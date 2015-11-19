'use strict';

(function () {

  var MongoClient = require('mongodb').MongoClient;
  var ObjectID = require('mongodb').ObjectID;
  var q = require("q");

  var db = undefined;

  module.exports = {
    init: function init() {
      var conn = "mongodb://" + process.env.DBUSER + ":" + process.env.DBPASS + "@" + process.env.DBURL;
      MongoClient.connect(conn, function (err, _db) {
        if (!err) {
          console.log("DB Connection Successful");
          db = _db;
        } else {
          throw err;
        }
      });
      return this;
    },
    addPass: function addPass(pass, numberOfUses, hoursToLive, from) {
      var deferred = q.defer();
      var coll = db.collection("pass");
      pass = pass.length > 140 ? pass.substr(0, 140) : pass;
      from = from && from.length > 140 ? from.substr(0, 140) : from;
      var deathDate = new Date().getTime() + (hoursToLive || 24) * 1000 * 60 * 60;
      if (!isNaN(deathDate)) {
        coll.insert({ pass: pass, numberOfUses: +numberOfUses || 1, from: from, deathDate: deathDate }, { w: 1 }, function (err, res) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(res.ops[0]._id);
          }
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    },
    getPass: function getPass(id) {
      var deferred = q.defer();
      var coll = db.collection("pass");
      coll.findOne({ _id: new ObjectID(id) }, function (err, doc) {
        if (err) {
          deferred.reject(err);
        }
        if (doc == null) {
          deferred.resolve(false);
        } else if (doc.deathDate < new Date().getTime()) {
          deferred.resolve(false);
          coll.remove({ _id: ObjectID(id) }, true);
        } else if (doc.numberOfUses === 1) {
          deferred.resolve(doc.pass);
          coll.remove({ _id: ObjectID(id) }, true);
        } else if (doc.numberOfUses > 1) {
          coll.update({ _id: ObjectID(id) }, { $inc: { numberOfUses: -1 } }, function (err, result) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(doc.pass);
            }
          });
        } else {
          deferred.resolve(false);
          coll.remove({ _id: ObjectID(id) }, true);
        }
      });
      return deferred.promise;
    },
    validatePasses: function validatePasses() {
      var deferred = q.defer();
      try {
        var coll = db.collection("pass");
        deferred.resolve(coll.remove({ $or: [{ numberOfUses: { $lte: 0 } }, { deathDate: { $lte: new Date().getTime() } }, { deathDate: { $eq: "NaN" } }] }));
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  };
})();