const readline = require('readline');
const fs = require('fs')

const getGuilds = require('./modules/getGuild.js')
const getVanityUrlCode = require('./modules/getVanity.js')
const Webhook = require('./modules/sendWebhook.js')
const initializeWebSocket = require('./modules/initializeWebSocket.js')
const validateSettings = require('./modules/checkSettings.js')

const settings = require('./config/settings.js')
validateSettings();

const today = new Date();
const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`

function startProcess() {
    const data = settings.data
    const userAccessToken = data.watchertoken
    getGuilds
      .getGuilds(userAccessToken)
      .then(guilds => {
        return Promise.all(
          guilds.map(guildId =>
            getVanityUrlCode.getVanityUrlCode(guildId, userAccessToken)
          )
        )
      })
      .then(vanityUrlCodes => {
        vanityUrlCodes = vanityUrlCodes.filter(code => code !== null)
        fs.writeFileSync('./json/guilds.json', JSON.stringify(vanityUrlCodes, null, 2))
        Webhook.sendWebhook(
          `[rxckstar] ${vanityUrlCodes.map(guild => `\`${guild.vanity_url_code}\``).join(', ')}`
        )
        initializeWebSocket(userAccessToken, {
          os: "linux",
          browser: "chrome",
          device: "desktop"
      });
      })
      .catch(error => {
        console.error('Error:', error)
      })
}

//rxckstar
