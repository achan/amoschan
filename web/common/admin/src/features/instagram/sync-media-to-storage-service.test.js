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
          "instagram:283811893/3057966446139158432-5d419157ffc144f6b3189583d30142c8.mp4",
          "instagram:283811893/3057966446139158432-6ec48827219ad3f7485d693f9778a263.mp4",
          "instagram:283811893/3057966446139158432-9ab627884bd7dce2bd2cbd4adcf8b3f5.jpg",
          "instagram:283811893/3057966446139158432-aa52efc056173012f3cc00f2cc2e9a97.jpg",
          "instagram:283811893/3057966446139158432-b43473f6267921ea990bf5a58c152c62.jpg",
          "instagram:283811893/3057966446139158432-b4bf51daf9b402aa3bf974c0b8e9a3f8.jpg",
          "instagram:283811893/3057966446139158432-c13ff90f3ab7b5ade0f4b759f75e08f9.mp4",
          "instagram:283811893/3057966446139158432-fc4e623a405999e866e33d292f12c7ea.jpg",
          "instagram:283811893/3057966446139158432-fd51d290698977fbd13b5c342d3daac3.jpg",
        ])
      )
    })
  })
})
