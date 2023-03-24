require("dotenv").config()

const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")

module.exports = class CommandRunner {
  constructor() {
    console.log({ serviceAccount: process.env.SERVICE_ACCOUNT_PATH })
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
      await command.run(this.app, console)

      console.log("Done ✅")
    } catch (error) {
      console.error({ error })
    }
  }
}
