const { WebClient } = require("@slack/web-api")

module.exports = class SlackLogger {
  constructor(token, channel, prefix = "Flexday") {
    this.slack = new WebClient(token)
    const uniqueId = (Math.random() + 1).toString(36).substring(7)
    this.prefix = `${prefix} \`${uniqueId}\``
    this.channel = channel
  }

  async log(message) {
    await this.slack.chat.postMessage({
      text: `[${this.prefix}] ${message}`,
      channel: this.channel,
    })
    console.log(message)
  }

  async error(message, error = null) {
    await this.slack.chat.postMessage({
      text: `[${this.prefix}] 🚨 ${message}`,
      channel: this.channel,
    })
    console.error(message, error)
  }

  async debug(message) {
    console.debug(message)
  }
}
