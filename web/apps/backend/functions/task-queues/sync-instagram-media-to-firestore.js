const functions = require("firebase-functions")
const { getFirestore } = require("firebase-admin/firestore")
const { getFunctions } = require("firebase-admin/functions")
const {
  Instagram: { Api, SyncUserMediaToFirestoreService },
} = require("@amoschan/common-admin")

module.exports.syncInstagramMediaToFirestore = ({ app }) =>
  functions
    .runWith({ timeoutSeconds: 540 })
    .tasks.taskQueue({
      retryConfig: {
        maxAttempts: 5,
        minBackoffSeconds: 60 * 5,
      },
      rateLimits: {
        maxConcurrentDispatches: 1,
      },
    })
    .onDispatch(async () => {
      const firestore = getFirestore(app)
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
