const functions = require("firebase-functions")
const {
  Intercom: { CleanUpService },
  Loggers: { SlackLogger },
} = require("@flexday/common-admin")
const { Client } = require("intercom-client")

module.exports.intercomCleanup = ({ app }) =>
  functions
    .runWith({
      secrets: [
        "INTERCOM_ACCESS_TOKEN",
        "SLACK_TOKEN",
        "SLACK_LOGGER_CHANNEL_ID",
      ],
      timeoutSeconds: 540,
    })
    .pubsub.schedule("0 19 * * *")
    .onRun(async () => {
      const logger = new SlackLogger(
        process.env.SLACK_TOKEN,
        process.env.SLACK_LOGGER_CHANNEL_ID,
        "IntercomCleanup"
      )

      const intercom = new Client({
        tokenAuth: { token: process.env.INTERCOM_ACCESS_TOKEN },
      })

      await new CleanUpService(false, { app, intercom, logger }).perform()
    })
