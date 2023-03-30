const CommandRunner = require("./command-runner")
const { getFirestore } = require("firebase-admin/firestore")
const { getStorage } = require("firebase-admin/storage")
const {
  Instagram: { Api, SyncUserMediaToFirestoreService },
} = require("@amoschan/common-admin")

class Command {
  async run(app, logger) {
    const firestore = getFirestore(app)

    const instagram = new Api(
      "https://red-wave-9167.fly.dev",
      "58637615932%3AqNYqB3dE3e48CZ%3A5%3AAYee2nFkMKuuuj9JgiE5vbwSxmREtAOK2z3VYVjMmQ"
    )

    await new SyncUserMediaToFirestoreService("instagram:283811893", {
      firestore,
      logger,
      instagram,
    }).perform()
  }
}

new CommandRunner()
  .run(new Command(), "SyncUserMedia-cli")
  .then(() => process.exit())
