(() => {
	"use strict";

	const crypto = require("crypto");
	const q = require("q");

	module.exports = {
    keygen() {
			const deferred = q.defer();
      crypto.randomBytes(16, (e, buf) => {
        if(e) {
          deferred.reject(e);
        } else {
        	deferred.resolve(buf.toString("hex"));
				}
      });
			return deferred.promise;
    },
	  encrypt(content, key) {
			const deferred = q.defer();
      let encrypted, cipher;

      cipher = crypto.createCipher("aes-256-cbc", key);
      encrypted = cipher.update(content, "utf8", "hex");
      encrypted += cipher.final("hex");
			cipher = null;

			deferred.resolve(encrypted);
			return deferred.promise;
		},
		decrypt(content, key) {
			const deferred = q.defer();
      let decrypted, cipher;

      cipher = crypto.createDecipher("aes-256-cbc", key);
      decrypted = cipher.update(content, "hex", "utf8");
      decrypted += cipher.final("utf8");

			deferred.resolve(decrypted);
			return deferred.promise;
		}
	};

})();
