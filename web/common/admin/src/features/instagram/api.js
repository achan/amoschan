const fetch = require("node-fetch")

module.exports = class Api {
  constructor(sessionId = null, { fetch: fetchDependency }) {
    this.baseUrl = process.env.INSTAGRAM_API_HOST
    this.fetch = fetchDependency || fetch
    this.sessionId = sessionId
  }

  async login({ username, password }) {
    const response = await this.fetch(`${this.baseUrl}/auth/login`, {
      method: "post",
      body: new URLSearchParams({ username, password })
    })

    this.sessionId = await response.json()

    return this.sessionId
  }

  async userMedia({ userId, amount = 50 }) {
    const response = await this.fetch(`${process.env.INSTAGRAM_API_HOST}/media/user_medias`, {
      method: "post",
      body: new URLSearchParams({
        user_id: userId,
        sessionid: this.sessionId,
        amount: amount,
      })
    })

    return response.json()
  }
}
