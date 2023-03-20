require("dotenv").config()

const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")
const {
  Loggers: { SlackLogger },
} = require("@flexday/common-admin")

module.exports = class CommandRunner {
  constructor() {
    const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH)

    const config = {
      credential: cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    }

    this.app = initializeApp(config)

    getFirestore(this.app) // not sure why this is needed but it crashes if it's not there
  }

  async run(command, logId) {
    try {
      await command.run(
        this.app,
        new SlackLogger(
          process.env.SLACK_TOKEN,
          process.env.SLACK_LOGGER_CHANNEL_ID,
          logId
        )
      )

      console.log("Done ✅")
    } catch (error) {
      console.error({ error })
    }
  }
}
