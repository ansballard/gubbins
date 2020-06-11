const { parse } = require("querystring");
const { readFile } = require("fs");
const { promisify } = require("util");
const { get } = require("microrouter");

let fileMap = {};

exports.renderFile = async (url, filePath, name, transform) => {
  return get(
    url,
    async (req, res) => {
      const params = parse(req.url.slice(url.length + 1));
      try {
        if(!fileMap[name] || params.update) {
          const raw = await readFileAsync(filePath, "utf8");
          fileMap[name] = transform ? transform(raw) : raw;
        }
        send(res, 200, fileMap[name]);
      } catch (e) {
        console.log(e);
        send(res, 500);
      }
    }
  )
}