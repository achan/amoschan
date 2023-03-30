const { FieldValue } = require("firebase-admin/firestore")
const RefreshScraperTokenService = require("./refresh-scraper-token-service")

module.exports = class SyncUserMediaToFirestoreService {
  constructor(accountId, { firestore, logger, instagram }) {
    this.accountId = accountId
    this.logger = logger
    this.instagram = instagram
    this.firestore = firestore
  }

  async perform() {
    const accountSnapshot = await this.firestore
      .collection("accounts")
      .doc(this.accountId)
      .get()

    if (!accountSnapshot.exists) {
      return
    }

    const account = accountSnapshot.data()

    this.logger.debug(`syncing user media for ${account.type}:${account.pk}...`)

    const mediaList = (await this._fetchUserMedia(account)).filter(
      (media) =>
        !account.lastScrapedAt ||
        new Date(media.taken_at) > account.lastScrapedAt.toDate()
    )

    for (const media of mediaList) {
      await accountSnapshot.ref
        .collection("media")
        .doc(media.pk)
        .set({ ...media, _metadata: { type: "instagram", status: "new" } })
    }

    await accountSnapshot.ref.update({
      lastScrapedAt: FieldValue.serverTimestamp(),
    })
  }

  async _fetchUserMedia(account, retryOnFail = true) {
    try {
      const response = await this.instagram.userMedia({ userId: account.pk })
      const { require_login } = JSON.parse(
        (response.detail || "{}").replaceAll("'", '"').toLowerCase()
      )

      if (!require_login) {
        return response
      }
    } catch (e) {
      await this.logger.error("An error occurred while fetching user media", e)
    }

    if (retryOnFail) {
      this.instagram = await new RefreshScraperTokenService(account.scraper, {
        firestore: this.firestore,
        logger: this.logger,
        fetch: this.fetch,
      }).perform()

      return this._fetchUserMedia(account, false)
    }

    return []
  }
}
