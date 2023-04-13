const { initializeApp } = require("firebase-admin/app")
const app = initializeApp()

exports.onScraperWrite = require("./on-scraper-write").init({ app })
exports.scheduledTasks = require("./scheduled-tasks").init({ app })
exports.taskQueues = require("./task-queues").init({ app })
