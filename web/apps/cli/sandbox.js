const CommandRunner = require("./command-runner")
const {
  Instagram: { SyncUserMediaToFirestore },
} = require("@flexday/common-admin")
const { format, compareAsc } = require("date-fns")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class Command {
  async run(app, logger) {
    await new SyncUserMediaToFirestore(
      session_id,
      user_id,
      { logger }
    ).perform()
  }
}

new CommandRunner().run(new Command(), "Sandbox-cli").then(() => process.exit())
