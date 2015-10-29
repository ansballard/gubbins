var express = require("express");
  var bodyParser = require("body-parser");
  var cookieParser = require("cookie-parser");
  var methodOverride = require("method-override");
  var session = require("express-session");
  var cors = require("cors");
  var morgan = require("morgan");
var app = express();

var http = require("http");
var path = require("path");

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var corsOptions = {
  origin: true,
  methods: ["GET", "POST"]
};

app.set("port", port);
app.set("ip", ipaddress);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan(process.env.OPENSHIFT_NODEJS_IP ? undefined : "dev"));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({secret: process.env.DBEXPRESSSECRET ? process.env.DBEXPRESSSECRET : "devSecret", resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

require("./routes.js")(app);

http.createServer(app).listen(app.get("port"), app.get("ip"), function() { "use strict";
  console.log("Express server listening at " + app.get("ip") + ":" + app.get("port"));
});
