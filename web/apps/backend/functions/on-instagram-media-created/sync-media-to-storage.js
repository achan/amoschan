const functions = require("firebase-functions")
const { getFirestore } = require("firebase-admin/firestore")
const {
  Instagram: { SyncMediaToStorageService },
} = require("@flexday/common-admin")

module.exports.applyBadges = ({ app }) =>
  functions.firestore
    .document("/accounts/{accountPk}/media/{mediaPk}")
    .onCreate(async (snapshot, context) => {
      await logger.debug("Applying badges to new booking...")

      const { bookingId } = context.params
      const { uid, email } = snapshot.data()

      const badges = []

      if (await isFirstCheckIn(uid, app)) {
        badges.push("firstCheckIn")
      }

      const firestore = getFirestore(app)
      const { team } = (await firestore.doc(`/users/${uid}`).get()).data()
      if (team) {
        badges.push("teamMember")
      }

      if (badges.length > 0) {
        for (const badge of badges) {
          await snapshot.ref.update({ badges: arrayUnion(badge) })
        }
        await logger.log(
          `Applied badges (${badges.join(", ")}) to booking ${bookingId}`
        )
      }

      await logger.debug("✅")
    })
