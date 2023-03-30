const { getFirestore, FieldValue } = require("firebase-admin/firestore")
const { getUserMetadata } = require("../users/utils")

module.exports = class CreationTimestampService {
  constructor(documentPath, { app, logger = console }) {
    this.firestore = getFirestore(app)
    this.documentPath = documentPath
    this.logger = logger
  }

  async perform() {
    try {
      const snapshot = await this.firestore.doc(this.documentPath).update({
        "computed.createdAt": FieldValue.serverTimestamp(),
      })

      await this.logger.debug(
        `Set createdAt timestamp for ${this.documentPath}`
      )
    } catch (error) {
      await this.logger.error(
        `An error occurred populating createdAt timestamp for ${this.documentPath}`
      )

      throw error
    }
  }
}
