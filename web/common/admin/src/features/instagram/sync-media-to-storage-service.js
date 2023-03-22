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

    const accountSnapshot = await mediaSnapshot.ref.parent.parent.get()
    const account = accountSnapshot.data()

    const assets = [
      media.video_url,
      media.thumbnail_url,
      ...media.resources.map(r => r.thumbnail_url),
      ...media.resources.map(r => r.video_url),
    ].filter(a => a)

    for (const asset of assets) {
      await this._syncAsset(account, media, asset)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  async _syncAsset(account, media, url) {
    const hash = crypto.createHash("md5").update(url).digest("hex")

    const fileExtension = url
      .split(/[#?]/)[0]
      .split('.')
      .pop()
      .trim()

    const filename = `${media.pk}-${hash}.${fileExtension}`

    const assetPath = `${account.type}:${account.pk}/${filename}`
    const localPath = `/tmp/${filename}`

    this.logger.debug(`Syncing ${assetPath}...`)

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
