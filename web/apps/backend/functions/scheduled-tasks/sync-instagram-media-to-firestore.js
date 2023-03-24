const functions = require("firebase-functions")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const { Instagram: { Api, SyncUserMediaToFirestoreService } } = require("@amoschan/common-admin")

module.exports.syncInstagramMediaToFirestore = ({ app }) =>
  functions
    .runWith({ timeoutSeconds: 540 })
    .pubsub.schedule("0 * * * *")
    .onRun(async () => {
      const firestore = getFirestore(app)
      const storage = getStorage(app)
      const logger = console

      const accountSnapshot = await firestore
        .collection("accounts")
        .where("type", "==", "instagram")
        .where("status", "==", "active")
        .orderBy("lastScrapedAt")
        .limit(1)
        .get()

      if (accountSnapshot.empty) {
        logger.log("No account to sync, exiting...")
        return
      }

      const account = accountSnapshot.docs[0]

      const { scraper } = account.computed

      const instagram = new Api(host, scraper.sessionId)

      await new SyncUserMediaToFirestoreService(id, { instagram, firestore, logger })
        .perform()
    })

