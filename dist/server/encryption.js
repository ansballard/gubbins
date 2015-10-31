(() => {
  "use strict";

  const crypto = require("crypto");

  module.exports = {
    keygen(cb) {
      crypto.randomBytes(16, (e, buf) => {
        if (e) {
          throw e;
        }
        cb(buf.toString("hex"));
      });
    },
    encrypt(content, key) {
      let encrypted, cipher;

      cipher = crypto.createCipher("aes-256-cbc", key);
      encrypted = cipher.update(content, "utf8", "hex");
      encrypted += cipher.final("hex");

      return encrypted;
    },
    decrypt(content, key) {
      let decrypted, cipher;

      cipher = crypto.createDecipher("aes-256-cbc", key);
      decrypted = cipher.update(content, "hex", "utf8");
      decrypted += cipher.final("utf8");

      return decrypted;
    }
  };
})();