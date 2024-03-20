const axios = require('axios')

module.exports = {
  getVanityUrlCode: async (guildId, botToken) => {
    try {
      const headers = {
        Authorization: `${botToken}`
      }

      const response = await axios.get(
        `https://discord.com/api/v10/guilds/${guildId}`,
        { headers }
      )
      const guild = response.data
      const arrayguild = JSON.stringify(guild)
      const guildid = JSON.parse(arrayguild).id
      const vanityUrlCode = JSON.parse(arrayguild).vanity_url_code
      const lastdata = {
        id: guildid,
        vanity_url_code: vanityUrlCode
      }
      if (lastdata.vanity_url_code === null) {
        return null
      }
      return lastdata
    } catch (error) {
      console.error('Error fetching vanity URL code:', error)
      throw error
    }
  }
}
