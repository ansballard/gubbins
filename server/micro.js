const { join } = require("path");

const { send, json } = require("micro");
const { router } = require("microrouter");
const corsBuilder = require("micro-cors");
const compress = require("micro-compress");
const marked = require("marked");

const { get, post } = require("microrouter");

const { keygen, encrypt, decrypt } = require("./encryption");
const { addGub, getGub } = require("./database");
const { renderFile } = require("./utils");

const cors = corsBuilder();

module.exports = cors(compress(router(
  // renderFile("/", join(__dirname, "index.html"), "index"),
  // renderFile("/readme", join(__dirname, "..", "README.md"), "readme", marked),
  // renderFile("/changelog", join(__dirname, "..", "CHANGELOG.md"), "changelog", marked),
  get("/api/generate/:content", async (req, res) => {
    const { id, key } = await keygen();
    await addGub(
      encrypt(req.params.content, key),
      id
    );
    send(res, 200, {
      id,
      key
    });
  }),
  get("/gub/:id/:key", async (req, res) => {
    const { id, key } = req.params;
    const { content, from } = await getGub(id) || {};
    if(!content) {
      return send(res, 404);
    }
    const decrypted = await decrypt(content, key);
    send(res, 200, {
      content: decrypted,
      from
    });
  }),
)));
