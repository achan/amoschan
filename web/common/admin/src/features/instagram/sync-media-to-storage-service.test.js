const SyncMediaToStorageService = require("./sync-media-to-storage-service")
const admin = require("firebase-admin")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const { fetchBuilder, FileSystemCache } = require("node-fetch-cache")
require("dotenv").config()

describe("Instagram/SyncMediaToStorageService", () => {
  const pk = "283811893"

  let app, firestore, serviceAccount, storage

  beforeAll(async () => {
    serviceAccount = {
      type: "service_account",
      project_id: "amoschan-test",
      private_key_id: "4089b0a479e947a71e6cdce94a7dc66400569cb6",
      private_key: process.env.TEST_FIREBASE_PRIVATE_KEY,
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
      storageBucket: `${process.env.TEST_FIREBASE_PROJECT_ID}.appspot.com`,
    })

    firestore = getFirestore(app)
    storage = getStorage(app)
  })

  describe("perform", () => {
    let startDate

    beforeAll(async () => {
      startDate = new Date()

      const service = new SyncMediaToStorageService(
        `/accounts/instagram:${pk}/media/3057966446139158432`,
        {
          firestore,
          storage,
          logger: console,
          fetch: fetchBuilder.withCache(
            new FileSystemCache({
              cacheDirectory: "testRequests",
            })
          ),
        }
      )

      await service.perform()
    }, 60000)

    test("it scrapes the post", async () => {
      const [files] = await storage
        .bucket()
        .getFiles({ prefix: `instagram:${pk}` })

      const recentlyCreatedFiles = files
        .map((f) => f.metadata)
        .filter((f) => new Date(f.timeCreated) > startDate)

      expect(new Set(recentlyCreatedFiles.map((f) => f.name))).toEqual(
        new Set([
          "instagram:283811893/3057966446139158432-1f7b0a4a5503a754c110a57a5effb1f1.jpg",
          "instagram:283811893/3057966446139158432-249c7b004e621f1f5255923fd059b2db.jpg",
          "instagram:283811893/3057966446139158432-3c942030be96d292373863172b2ba7ef.jpg",
          "instagram:283811893/3057966446139158432-4b8cda371978e00840a4741cb111e6f8.mp4",
          "instagram:283811893/3057966446139158432-6f744e1b479e6da2c4c920ea96b8cdf5.jpg",
          "instagram:283811893/3057966446139158432-7f6e12bb6475370513b1f0c432a07d12.mp4",
          "instagram:283811893/3057966446139158432-81677a89ed833bc2985fbfd8b8564441.mp4",
          "instagram:283811893/3057966446139158432-cc9e13e01e8aec280547027a77a3fa80.jpg",
          "instagram:283811893/3057966446139158432-e1a8d8bcb20425c40d8efc71ab5e0b70.jpg",
        ])
      )
    })
  })
})
