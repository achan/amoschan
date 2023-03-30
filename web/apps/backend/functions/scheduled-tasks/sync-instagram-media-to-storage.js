const functions = require("firebase-functions")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const {
  Instagram: { SyncMediaToStorageService },
} = require("@amoschan/common-admin")

module.exports.syncInstagramMediaToStorage = ({ app }) =>
  functions
    .runWith({ timeoutSeconds: 540 })
    .pubsub.schedule("*/2 * * * *")
    .onRun(async () => {
      const firestore = getFirestore(app)
      const storage = getStorage(app)
      const logger = console

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

      const path = mediaSnapshot.docs[0].ref.path

      await new SyncMediaToStorageService(path, {
        firestore,
        storage,
        logger,
      }).perform()
    })
