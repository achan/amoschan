const SyncMediaToStorageService = require("./sync-media-to-storage-service")
const admin = require("firebase-admin")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const { fetchBuilder, FileSystemCache } = require("node-fetch-cache")
require("dotenv").config()

describe("Instagram/SyncMediaToStorageService", () => {
  const pk = "283811893"

  let app,
    firestore,
    service,
    serviceAccount,
    storage

  beforeAll(async () => {
    serviceAccount = {
      "type": "service_account",
      "project_id": "amoschan-test",
      "private_key_id": "4089b0a479e947a71e6cdce94a7dc66400569cb6",
      "private_key": process.env.TEST_FIREBASE_PRIVATE_KEY,
      "client_email": "firebase-adminsdk-i0ruj@amoschan-test.iam.gserviceaccount.com",
      "client_id": "101310353030596582028",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i0ruj%40amoschan-test.iam.gserviceaccount.com"
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${process.env.TEST_FIREBASE_PROJECT_ID}.appspot.com`,
    })

    firestore = getFirestore(app)
    storage = getStorage(app)
  })

  beforeEach(async () => {
    service = new SyncMediaToStorageService(
      `/accounts/instagram:${pk}/media/3057966446139158432`,
      {
        firestore,
        storage,
        logger: console,
        fetch: fetchBuilder.withCache(new FileSystemCache({
          cacheDirectory: "testRequests",
        })),
      }
    )
  })

  describe("perform", () => {
    test("it scrapes the instagram profile", async () => {
      await service.perform()

      expect(1).toBe(2)
    }, 3000000)
  })
})

