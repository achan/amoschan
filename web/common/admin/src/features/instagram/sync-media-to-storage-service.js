const fetch = require("node-fetch")
const fs = require("fs")
const { Helpers: { Instagram: { getFileInfo } } } = require("@amoschan/common")

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

    await mediaSnapshot.ref.update({ "_metadata.status": "assetsSyncing" })

    const media = mediaSnapshot.data()

    const accountSnapshot = await mediaSnapshot.ref.parent.parent.get()
    const account = accountSnapshot.data()

    const assets = [
      media.video_url,
      media.thumbnail_url,
      ...media.resources.map(r => r.thumbnail_url),
      ...media.resources.map(r => r.video_url),
    ].filter(a => a)

    for (const asset of assets) {
      await this._syncAsset(account, media.pk, asset)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    await mediaSnapshot.ref.update({ "_metadata.status": "assetsSynced" })
  }

  async _syncAsset(account, mediaPk, url) {
    const { filename, filePath: assetPath } = getFileInfo(account, mediaPk, url)
    await this.logger.debug(`Syncing ${assetPath}...`)

    const localPath = `/tmp/${filename}`
    await this._downloadFile(url, localPath)
    await this.bucket.upload(localPath, { destination: assetPath })
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
