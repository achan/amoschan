const CommandRunner = require("./command-runner")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const {
  Scrapers: { AssociationService },
} = require("@amoschan/common-admin")

class Command {
  async run(app, logger) {
    const firestore = getFirestore(app)

    await new AssociationService("/accounts/instagram:283811893", {
      firestore,
      logger,
    }).perform()
  }
}

new CommandRunner().run(new Command(), "Sandbox-cli").then(() => process.exit())
