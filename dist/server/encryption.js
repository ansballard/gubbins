"use strict";

(function () {

  var crypto = require("crypto");
  var q = require("q");

  module.exports = {
    keygen: function keygen() {
      var deferred = q.defer();
      crypto.randomBytes(16, function (e, buf) {
        if (e) {
          deferred.reject(e);
        } else {
          deferred.resolve(buf.toString("hex"));
        }
      });
      return deferred.promise;
    },
    encrypt: function encrypt(content, key) {
      var deferred = q.defer();
      var encrypted = undefined,
          cipher = undefined;

      cipher = crypto.createCipher("aes-256-cbc", key);
      encrypted = cipher.update(content, "utf8", "hex");
      encrypted += cipher.final("hex");
      cipher = null;

      deferred.resolve(encrypted);
      return deferred.promise;
    },
    decrypt: function decrypt(content, key) {
      var deferred = q.defer();
      var decrypted = undefined,
          cipher = undefined;

      cipher = crypto.createDecipher("aes-256-cbc", key);
      decrypted = cipher.update(content, "hex", "utf8");
      decrypted += cipher.final("utf8");

      deferred.resolve(decrypted);
      return deferred.promise;
    }
  };
})();