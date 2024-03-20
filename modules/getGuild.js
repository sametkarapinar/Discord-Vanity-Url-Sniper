const axios = require('axios')
const settings = require('../config/settings.js')
module.exports = {
  getGuilds: async userAccessToken => {
    try {
      const headers = {
        Authorization: `${userAccessToken}`
      }

      const response = await axios.get(
        'https://discord.com/api/v10/users/@me/guilds',
        { headers }
      )
      return response.data.map(guild => guild.id)
    } catch (error) {
      console.error('Hata:', error)
      throw error
    }
  }
}
