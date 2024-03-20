const axios = require('axios')
const settings = require('../config/settings.js');
module.exports = {
  sendWebhook: async (message) => {
    const data = settings.data
    const webhook = data.webhook
    try {
      const response = await axios.post(webhook, {
        content: message,
        username: 'Vanity',
        avatar_url: 'https://cdn.discordapp.com/attachments/1215356024777875466/1215356063193501696/discord-avatar-512-OTD0I.png?ex=65fc7389&is=65e9fe89&hm=28e54ebee29c01dcb52abe9dca748b1483bed46dcc0a2cda34a27e17b014ded6&'
      })
    } catch (error) {
      console.error('Error sending webhook:', error)
      throw error
    }
  }
}
