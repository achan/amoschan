const functions = require("firebase-functions")
const { initializeApp } = require("firebase-admin/app")
const app = initializeApp()

exports.scheduledTasks = require("./scheduled-tasks").init({ app })
