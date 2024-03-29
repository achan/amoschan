const functions = require("firebase-functions")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const {
  Instagram: { Api, SyncUserMediaToFirestoreService },
} = require("@amoschan/common-admin")

module.exports.syncInstagramMediaToFirestore = ({ app }) =>
  functions
    .runWith({ timeoutSeconds: 540 })
    .pubsub.schedule("*/30 * * * *")
    .onRun(async () => {
      const firestore = getFirestore(app)
      const storage = getStorage(app)
      const logger = console

      const querySnapshot = await firestore
        .collection("accounts")
        .where("type", "==", "instagram")
        .where("status", "==", "active")
        .orderBy("lastScrapedAt")
        .limit(1)
        .get()

      if (querySnapshot.empty) {
        logger.log("No account to sync, exiting...")
        return
      }

      const accountSnapshot = querySnapshot.docs[0]
      const account = accountSnapshot.data()

      const { scraper } = account.computed

      const instagram = new Api(scraper.host, scraper.sessionId)

      await new SyncUserMediaToFirestoreService(accountSnapshot.id, {
        instagram,
        firestore,
        logger,
      }).perform()
    })
