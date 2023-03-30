module.exports = class AssociationService {
  constructor(docPath, { firestore, logger }) {
    this.docPath = docPath
    this.logger = logger
    this.firestore = firestore
    this.fieldName = "scraper"
  }

  async perform() {
    await this.logger.log(`updating association for ${this.docPath}`)
    const snapshot = await this.firestore.doc(this.docPath).get()
    const scraperSnapshot = await this.firestore
      .collection("scrapers")
      .doc(snapshot.data()[this.fieldName])
      .get()

    const scraper = scraperSnapshot.data()

    await snapshot.ref.update({
      [`computed.${this.fieldName}`]: {
        sessionId: scraper.sessionId,
        host: scraper.host,
      },
    })
  }
}
