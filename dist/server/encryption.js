"use strict";

(function () {
  "use strict";

  var crypto = require("crypto");

  module.exports = {
    keygen: function keygen(cb) {
      crypto.randomBytes(16, function (e, buf) {
        if (e) {
          throw e;
        }
        cb(buf.toString("hex"));
      });
    },
    encrypt: function encrypt(content, key) {
      var encrypted = undefined,
          cipher = undefined;

      cipher = crypto.createCipher("aes-256-cbc", key);
      encrypted = cipher.update(content, "utf8", "hex");
      encrypted += cipher.final("hex");

      return encrypted;
    },
    decrypt: function decrypt(content, key) {
      var decrypted = undefined,
          cipher = undefined;

      cipher = crypto.createDecipher("aes-256-cbc", key);
      decrypted = cipher.update(content, "hex", "utf8");
      decrypted += cipher.final("utf8");

      return decrypted;
    }
  };
})();