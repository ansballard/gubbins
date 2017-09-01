const crypto = require("crypto");

module.exports = {
  keygen() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (e, buf) => {
        if (e) {
          reject(e);
        } else {
          resolve(buf.toString("hex"));
        }
      });
    });
  },
  encrypt(content, key) {
    let encrypted, cipher;

    cipher = crypto.createCipher("aes-256-cbc", key);
    encrypted = cipher.update(content, "utf8", "hex");
    encrypted += cipher.final("hex");
    cipher = null;

    return Promise.resolve(encrypted);
  },
  decrypt(content, key) {
    let decrypted, cipher;

    cipher = crypto.createDecipher("aes-256-cbc", key);
    decrypted = cipher.update(content, "hex", "utf8");
    decrypted += cipher.final("utf8");

    return Promise.resolve(decrypted);
  }
};
