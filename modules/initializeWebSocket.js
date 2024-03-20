const websocket = require('ws')
const Webhook = require('./sendWebhook')
const vanityUrl = require('./vanityUrl')
const fs = require('fs')
let ws
let interval = 0,
  seq = -1

function initializeWebSocket (token, options = {}) {
  let url = options.url || 'wss://gateway.discord.gg'
  let initialUrl = url
  let sessionId = ''

  let payload = {
    op: 2,
    d: {
      token: token,
      intents: options.intents || 3276799,
      properties: {
        $os: options.os || 'linux',
        $browser: options.browser || 'chrome',
        $device: options.device || 'desktop'
      }
    }
  }
  const heartbeat = ms => {
    return setInterval(() => {
      ws.send(JSON.stringify({ op: 1, d: null }))
    }, ms)
  }

  const connectWebSocket = () => {
    if (ws && ws.readyState === 3) ws.close()
    let wasReady = false
    ws = new websocket(url + '/?v=7&encoding=json')

    ws.on('open', function open () {
      if (url !== initialUrl) {
        const resumePayload = {
          op: 6,
          d: {
            token: payload.d.token,
            sessionId,
            seq
          }
        }
        ws.send(JSON.stringify(resumePayload))
      }
    })
    ws.on('error', function error (err) {
      console.log(err)
    })

    ws.on('close', function close () {
      if (wasReady) console.log('Connection closed. Reconnecting...')
      setTimeout(() => {
        connectWebSocket()
      }, 2500)
    })

    ws.on('message', function incoming (data) {
      let p = JSON.parse(data)
      const { t, s, op, d } = p

      switch (op) {
        case 10:
          const { heartbeat_interval } = d
          interval = heartbeat(heartbeat_interval)
          wasReady = true

          if (url === initialUrl) ws.send(JSON.stringify(payload))
          break
        case 0:
          seq = s
          break
      }

      switch (t) {
        case 'READY':
          console.log('Connected to Discord.')
          url = d.resume_gateway_url
          sessionId = d.session_id
          break
        case 'RESUMED':
          console.log('Resumed connection.')
          break
        case 'GUILD_UPDATE':
          const id = d.id
          fs.readFile('./json/guilds.json', 'utf8', (err, data) => {
            if (err) throw err
            const guilds = JSON.parse(data)
            const guild = guilds.find(g => g.id === id)
            if (guild) {
              vanityUrl
                .updateVanityURL(guild.vanity_url_code)
                .then(() => {
                  console.log('Vanity URL güncellendi.')
                })
                .catch(error => {
                  console.error(
                    formattedDate + ' Vanity URL güncelleme hatası:',
                    error
                  )
                })
            }
          })
          timeout = setTimeout(() => {
            process.exit()
          }, 1000)
      }
    })
  }

  connectWebSocket()
}

module.exports = initializeWebSocket
