const functions = require("firebase-functions")
const { getFunctions } = require("firebase-admin/functions")

const MIN_WAIT_TIME = 1
const MAX_WAIT_TIME = 10

module.exports.enqueueInstagramMediaSync = ({ app }) =>
  functions.pubsub.schedule("*/10 * * * *").onRun(async () => {
    const logger = console
    const queue = getFunctions(app).taskQueue(
      "taskQueues-syncInstagramMediaToFirestore"
    )
    const scheduleDelaySeconds =
      (Math.floor(Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME + 1)) +
        MIN_WAIT_TIME) *
      60
    await queue.enqueue(
      {},
      {
        scheduleDelaySeconds,
        dispatchDeadlineSeconds: 540,
      }
    )
  })
