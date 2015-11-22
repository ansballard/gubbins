import APIService from "./apiService.js";

(() => {
  "use strict";

  angular.module("gubbins.api", [])
    .factory("APIService", APIService)
  ;

})();
