const settings = require('../config/settings.js');

const validateSettings = () => {
    const data = settings.data;
    const guildId = data.guildid;
    const watcherToken = data.watchertoken;
    const vanityToken = data.vanitytoken;
    const webhook = data.webhook;
    
    if (guildId.length < 18) {
        console.error('Guild ID must be 18 characters long.');
        process.exit(1);
    }

    if (watcherToken.length < 59) {
        console.error('Watcher Token is invalid.');
        process.exit(1);
    }

    if (vanityToken.length < 59) {
        console.error('Vanity Token is invalid.');
        process.exit(1);
    }

    if (!webhook.startsWith('https://discord.com/api/webhooks/')) {
        console.error('Webhook Discord URL is invalid.');
        process.exit(1);
    }
};

module.exports = validateSettings;