const Api = require("./api")
const { fetchBuilder, FileSystemCache } = require("node-fetch-cache")

describe("Instagram/Api", () => {
  let sessionId, api

  beforeEach(async () => {
    sessionId = "58637615932%3AqNYqB3dE3e48CZ%3A5%3AAYee2nFkMKuuuj9JgiE5vbwSxmREtAOK2z3VYVjMmQ"
    api = new Api({ fetch: fetchBuilder.withCache(new FileSystemCache({
      cacheDirectory: "testRequests",
    })) })

    await api.login({
      username: process.env.INSTAGRAM_USERNAME,
      password: process.env.INSTAGRAM_PASSWORD,
    })
  })

  describe("userMedia", () => {
    const gigiPk = "5468237"

    test("it returns first page of user's media", async () => {
      const media = await api.userMedia({ userId: gigiPk })
      expect(media.length).toBe(50)
    })
  })
})
