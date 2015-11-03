(() => {
  "use strict";

  const express = require("express");
    const bodyParser = require("body-parser");
    const cookieParser = require("cookie-parser");
    const methodOverride = require("method-override");
    const session = require("express-session");
    const cors = require("cors");
    const morgan = require("morgan");
  const app = express();

  const http = require("http");
  const path = require("path");

  const database = require("./database").init();

  let ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
  let port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

  let corsOptions = {
    origin: true,
    methods: ["GET", "POST"]
  };

  app.set("port", port);
  app.set("ip", ipaddress);
  app.set("views", path.join(__dirname, "..", "..", "views"));
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

  require("./routes.js")(app, database);
  require("./cron.js")(database)
    .then((res) => {
      console.log("cronned");
    }, (e) => {
      console.log("failed");
    });

  http.createServer(app).listen(app.get("port"), app.get("ip"), () => { "use strict";
    console.log("Express server listening at " + app.get("ip") + ":" + app.get("port"));
  });

})();
