const {
  randomBytes,
  createCipheriv,
  createDecipheriv
} = require("crypto");
const { v4: uuid } = require("uuid");
const { promisify } = require("util");
const randomBytesAsync = promisify(randomBytes);

exports.keygen = async () => {
  const buf = await randomBytesAsync(16);
  return {
    key: buf.toString("hex"),
    id: uuid()
  };
}
exports.encrypt = (content, key) => {
  let encrypted, cipher;

  cipher = createCipheriv("aes-256-cbc", key, Buffer.alloc(16, 0));
  encrypted = cipher.update(content, "utf8", "hex");
  encrypted += cipher.final("hex");
  cipher = null;

  return encrypted;
}
exports.decrypt = (content, key) => {
  let decrypted, cipher;

  cipher = createDecipheriv("aes-256-cbc", key, Buffer.alloc(16, 0));
  decrypted = cipher.update(content, "hex", "utf8");
  decrypted += cipher.final("utf8");

  return decrypted;
}