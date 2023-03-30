const fetch = require("node-fetch")
const Api = require("./api")

module.exports = class RefreshScraperTokenService {
  constructor(scraperId, { firestore, logger, fetch: fetchDependency }) {
    this.scraperId = scraperId
    this.logger = logger
    this.firestore = firestore
    this.fetch = fetchDependency || fetch
  }

  async perform() {
    const scraperSnapshot = await this.firestore
      .collection("scrapers")
      .doc(this.scraperId)
      .get()

    if (!scraperSnapshot.exists) {
      return
    }

    const scraper = scraperSnapshot.data()

    const instagram = new Api(scraper.host, null, { fetch: this.fetch })
    const sessionId = await instagram.login({
      username: scraper.username,
      password: scraper.password,
    })

    await scraperSnapshot.ref.update({ sessionId })

    this.logger.debug(
      `refreshed scraper token ${this.scraperId} to ${sessionId}...`
    )

    return instagram
  }
}
