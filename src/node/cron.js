(() => {

  const cron = require("cron").CronJob;
  const q = require("q");

  module.exports = (database) => {
    const deferred = q.defer();
    new cron("20 40 03 * * *", () => {
      deferred.resolve(database.validatePasses());
    }, () => {
      
    }, true);
    return deferred.promise;
  };

})();
