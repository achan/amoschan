const Api = require("./api")
const SyncUserMediaToFirestoreService = require("./sync-user-media-to-firestore-service")
const admin = require("firebase-admin")
const { getFirestore } = require("firebase-admin/firestore")
const { fetchBuilder, FileSystemCache } = require("node-fetch-cache")
require("dotenv").config()

describe("Instagram/SyncUserMediaToFirestoreService", () => {
  const pk = "283811893"
  let app, firestore, instagram, service, serviceAccount, sessionId

  beforeAll(async () => {
    serviceAccount = {
      type: "service_account",
      project_id: "amoschan-test",
      private_key_id: "4089b0a479e947a71e6cdce94a7dc66400569cb6",
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email:
        "firebase-adminsdk-i0ruj@amoschan-test.iam.gserviceaccount.com",
      client_id: "101310353030596582028",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i0ruj%40amoschan-test.iam.gserviceaccount.com",
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })

    firestore = getFirestore(app)
  })

  beforeEach(async () => {
    sessionId =
      "58637615932%3AqNYqB3dE3e48CZ%3A5%3AAYee2nFkMKuuuj9JgiE5vbwSxmREtAOK2z3VYVjMmQ"
    instagram = new Api(process.env.INSTAGRAM_API_HOST, sessionId, {
      fetch: fetchBuilder.withCache(
        new FileSystemCache({
          cacheDirectory: "testRequests",
        })
      ),
    })

    service = new SyncUserMediaToFirestoreService(`instagram:${pk}`, {
      firestore,
      logger: console,
      instagram,
    })
  })

  describe("perform", () => {
    const startDate = new Date()

    test("it scrapes the instagram profile", async () => {
      await service.perform()
      const accountSnapshot = await firestore
        .collection("accounts")
        .doc(`instagram:${pk}`)
        .get()

      expect(accountSnapshot.data().lastScrapedAt.toMillis()).toBeGreaterThan(
        startDate.getTime()
      )
    }, 30000)
  })
})
