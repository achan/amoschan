const { initializeApp } = require("firebase-admin/app")
const app = initializeApp()

exports.scheduledTasks = require("./scheduled-tasks").init({ app })
exports.onScraperWrite = require("./on-scraper-write").init({ app })
