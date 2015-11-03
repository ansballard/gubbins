"use strict";

(function () {
  "use strict";

  var cron = require("cron").CronJob;
  var q = require("q");

  module.exports = function (database) {
    var deferred = q.defer();
    new cron("20 40 03 * * *", function () {
      deferred.resolve(database.validatePasses());
    }, function () {
      console.log("Cron Stopped");
    }, true);
    return deferred.promise;
  };
})();