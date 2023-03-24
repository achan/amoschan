const { syncInstagramMediaToStorage } = require("./sync-instagram-media-to-storage")
const { syncInstagramMediaToFirestore } = require("./sync-instagram-media-to-firestore")

module.exports.init = ({ app }) => ({
  syncInstagramMediaToStorage: syncInstagramMediaToStorage({ app }),
  syncInstagramMediaToFirestore: syncInstagramMediaToFirestore({ app }),
})
