const instagram = require("./api")

module.exports = class SyncUserMediaToFirestore {
  constructor(sessionId, userId, { logger, instagram }) {
    this.sessionId = sessionId
    this.userId = userId
    this.logger = logger
    this.instagram = instagram
  }

  async perform() {
    const response = await fetch(`${process.env.INSTAGRAM_API_HOST}/media/user_medias`, {
      method: "post",
      body: JSON.stringify({
        user_id: this.userId,
        session_id: this.sessionId,
        amount: 50,
      })
    })

    const medias = await this.instagram.userMedias({
      userId: this.userId,
      sessionId: this.sessionId,
      amount: 50,
    })
  }
}
