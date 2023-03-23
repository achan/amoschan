const functions = require("firebase-functions")
const { getUserMetadata } = require("../utils")
const {
  Teams: { ClearCheckInQuotas },
  Loggers: { SlackLogger },
} = require("@flexday/common-admin")

module.exports.clearTeamCheckInQuotas = ({ app }) =>
  functions
    .runWith({ secrets: ["SLACK_TOKEN", "SLACK_LOGGER_CHANNEL_ID"] })
    .pubsub.schedule("0 0 */4 * *")
    .onRun(async () => {
      const logger = new SlackLogger(
        process.env.SLACK_TOKEN,
        process.env.SLACK_LOGGER_CHANNEL_ID,
        "ClearCheckInQuotas"
      )
      await new ClearCheckInQuotas(app, logger).perform()
    })
