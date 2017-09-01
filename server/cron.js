const { CronJob } = require("cron");

module.exports = database => {
  return new Promise((resolve, reject) => {
    new CronJob(
      "20 40 03 * * *",
      () => {
        resolve(database.validatePasses());
      },
      () => {},
      true
    );
  });
};
