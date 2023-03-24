const functions = require("firebase-functions")
const { getFirestore } = require("firebase-admin/firestore")
const { Scrapers: { AssociationService } } = require("@amoschan/common-admin")

module.exports.updateAssociations = ({ app }) =>
  functions
    .firestore.document("/scrapers/{id}")
    .onWrite(async (change, context) => {
      const firestore = getFirestore(app)
      const logger = console

      const { id } = context.params

      await logger.debug(`fetching accounts using scraper: ${id}`)

      const accountsSnapshot = await firestore
        .collection("accounts")
        .where("scraper", "==", id)
        .where("status", "==", "active")
        .get()

      for (const account of accountsSnapshot.docs) {
        await new AssociationService(account.ref.path, { firestore, logger }).perform()
      }
    })
