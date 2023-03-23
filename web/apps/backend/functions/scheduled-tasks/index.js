const { syncInstagramMediaToStorage } = require("./sync-instagram-media-to-storage")

module.exports.init = ({ app }) => ({
  syncInstagramMediaToStorage: syncInstagramMediaToStorage({ app }),
})
