const { getFirestore } = require("firebase-admin/firestore")
const admin = require("firebase-admin")
const AssociationService = require("./association-service")
require("dotenv").config()

describe("Scrapers/AssociationService", () => {
  let app, firestore, serviceAccount, logger

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

    logger = console
  })

  describe("perform", () => {
    test("it updates the document's scraper association", async () => {
      const docPath = "/accounts/instagram:283811893"
      await new AssociationService(docPath, { firestore, logger }).perform()
      const account = (await firestore.doc(docPath).get()).data()

      expect(account.computed.scraper).not.toBeNull()
    }, 30000)
  })
})
