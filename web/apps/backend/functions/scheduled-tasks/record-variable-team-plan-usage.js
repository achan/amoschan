const functions = require("firebase-functions")
const {
  Teams: { RecordVariableTeamPlanUsageService },
  Loggers: { SlackLogger },
} = require("@flexday/common-admin")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports.recordVariableTeamPlanUsage = ({ app }) =>
  functions
    .runWith({
      secrets: ["STRIPE_SECRET_KEY", "SLACK_TOKEN", "SLACK_LOGGER_CHANNEL_ID"],
    })
    .pubsub.schedule("0 17 * * *")
    .onRun(async () => {
      const logger = new SlackLogger(
        process.env.SLACK_TOKEN,
        process.env.SLACK_LOGGER_CHANNEL_ID,
        "RecordVariableTeamPlanUsage"
      )
      await new RecordVariableTeamPlanUsageService(
        null,
        app,
        stripe,
        logger
      ).perform()
    })
