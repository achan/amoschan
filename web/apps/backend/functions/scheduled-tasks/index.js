const { enqueueInstagramMediaSync } = require("./enqueue-instagram-media-sync")
const {
  syncInstagramMediaToStorage,
} = require("./sync-instagram-media-to-storage")

module.exports.init = ({ app }) => ({
  syncInstagramMediaToStorage: syncInstagramMediaToStorage({ app }),
  enqueueInstagramMediaSync: enqueueInstagramMediaSync({ app }),
})
