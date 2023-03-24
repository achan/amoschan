module.exports = class AssociationService {
  constructor(docPath, { firestore, logger }) {
    this.docPath = docPath
    this.logger = logger
    this.firestore = firestore
  }

  async perform() {
    const snapshot = await this.firestore.doc(this.docPath).get()
    const scraperSnapshot = await this.firestore
      .collection("scrapers")
      .doc(snapshot.data().scraper)
      .get()

    await snapshot.ref.update({
      "computed.scraper": scraperSnapshot.data()
    })
  }
}

