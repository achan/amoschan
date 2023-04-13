const {
  syncInstagramMediaToFirestore,
} = require("./sync-instagram-media-to-firestore")

module.exports.init = ({ app }) => ({
  syncInstagramMediaToFirestore: syncInstagramMediaToFirestore({ app }),
})
