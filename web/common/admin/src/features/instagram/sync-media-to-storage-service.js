const crypto = require("crypto")
const fetch = require("node-fetch")
const fs = require("fs")

module.exports = class SyncMediaToStorageService {
  constructor(mediaDocPath, { storage, firestore, logger, fetch: fetchDependency }) {
    this.mediaDocPath = mediaDocPath
    this.logger = logger
    this.firestore = firestore
    this.storage = storage
    this.bucket = storage.bucket()
    this.fetch = fetchDependency || fetch
  }

  async perform() {
    const mediaSnapshot = await this.firestore
      .doc(this.mediaDocPath)
      .get()

    const media = mediaSnapshot.data()

    for (const resource of media.resources) {
      const hash = crypto.createHash("md5")
        .update(resource.thumbnail_url)
        .digest("hex")

      const accountSnapshot = await mediaSnapshot.ref.parent.parent.get()
      const account = accountSnapshot.data()

      const fileExtension = resource.thumbnail_url
        .split(/[#?]/)[0]
        .split('.')
        .pop()
        .trim()

      const filename = `${media.pk}-${hash}.${fileExtension}`

      const assetPath = `${account.type}:${account.pk}/${filename}`
      const localPath = `/tmp/${filename}`

      this.logger.debug(`Syncing ${assetPath}...`)

      await this._downloadFile(resource.thumbnail_url, localPath)
      await this.bucket.upload(localPath, { destination: assetPath })
    }
  }

  async _downloadFile(url, path) {
    const res = await fetch(url)
    const fileStream = fs.createWriteStream(path)
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream)
      res.body.on("error", reject)
      fileStream.on("finish", resolve)
    })
  }
}
