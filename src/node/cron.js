(() => {
  "use strict";

  const cron = require("cron").CronJob;
  const q = require("q");

  module.exports = (database) => {
    const deferred = q.defer();
    new cron("20 40 03 * * *", () => {
      deferred.resolve(database.validatePasses());
    }, () => {
      console.log("Cron Stopped");
    }, true);
    return deferred.promise;
  };

})();
