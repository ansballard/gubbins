const { CronJob } = require("cron");

module.exports = callback => {
  return new Promise((resolve, reject) => {
    new CronJob(
      "20 40 03 * * *",
      () => {
        resolve(callback());
      },
      () => {},
      true
    );
  });
};
