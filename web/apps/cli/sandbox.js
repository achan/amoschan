const CommandRunner = require("./command-runner")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")

class Command {
  async run(app, logger) {
    const firestore = getFirestore(app)
    const storage = getStorage(app)

    const mediaSnapshot = await firestore
      .collectionGroup("media")
      .where("_metadata.status", "==", "new")
      .where("_metadata.type", "==", "instagram")
      .orderBy("taken_at")
      .limit(1)
      .get()

    if (mediaSnapshot.empty) {
      logger.log("No media to sync, exiting...")
      return
    }
  }
}

new CommandRunner().run(new Command(), "Sandbox-cli").then(() => process.exit())
