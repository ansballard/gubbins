import "angular";
import "angular-route";

import "./api/api.module";
import "./gui/gui.module";

import "../../.tmp/templates";

import routes from "./routes/routeConfig";

(() => {
  "use strict";

  angular.module("gubbins", [
    "ngRoute",

    "gubbins.api",
    "gubbins.gui",
    "gubbins.templates"
  ]).config(routes);

})();
