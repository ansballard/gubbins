const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const http = require("http");
const { join } = require("path");

const database = require("./database").init();

let ip = process.env.IP || "127.0.0.1";
let port = process.env.PORT || 3001;

let corsOptions = {
  origin: true,
  methods: ["GET", "POST"]
};

app.set("views", join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.use(express.static("dist"));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan(process.env.NODE_ENV === "production" ? undefined : "dev"));

require("./routes.js")(app, database);
require("./cron.js")(database).then(
  () => {
    console.log("Cron Setup Successfully");
  },
  () => {
    console.log("There was an error starting Cron");
  }
);

http.createServer(app).listen(port, ip, () => {
  console.log(`Server Running at ${ip}:${port}`);
});
