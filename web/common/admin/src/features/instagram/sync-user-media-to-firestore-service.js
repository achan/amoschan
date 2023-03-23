const { FieldValue } = require("firebase-admin/firestore")

module.exports = class SyncUserMediaToFirestoreService {
  constructor(sessionId, userId, { firestore, logger, instagram }) {
    this.sessionId = sessionId
    this.userId = userId
    this.logger = logger
    this.instagram = instagram
    this.firestore = firestore
  }

  async perform() {
    const accountSnapshot = await this.firestore
      .collection("accounts")
      .doc(`instagram:${this.userId}`)
      .get()

    if (!accountSnapshot.exists) {
      return
    }

    const account = accountSnapshot.data()

    this.logger.debug(`syncing user media for ${account.type}:${account.pk}...`)

    const mediaList = await this.instagram.userMedia({ userId: this.userId })
    for (const media of mediaList) {
      await accountSnapshot.ref.collection("media")
        .doc(media.pk)
        .set({ ...media, _metadata: { type: "instagram", status: "new" } })
    }

    await accountSnapshot.ref.update({ lastScrapedAt: FieldValue.serverTimestamp() })
  }
}
