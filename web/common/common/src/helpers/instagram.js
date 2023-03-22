const crypto = require("crypto")

const getFileInfo = (account, mediaPk, url) => {
  const hash = crypto.createHash("md5").update(url).digest("hex")

  const fileExtension = url
    .split(/[#?]/)[0]
    .split('.')
    .pop()
    .trim()

  const filename = `${mediaPk}-${hash}.${fileExtension}`

  return {
    filename, 
    filePath: `${account.type}:${account.pk}/${filename}`
  }
}

module.exports = {
  getFileInfo,
}
