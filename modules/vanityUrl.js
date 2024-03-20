const axios = require('axios');
const settings = require('../config/settings.js');
const updateVanityURL = async (vanity) => {
    //settings data içinden
    const data = settings.data
    const SNIPER_GUILD_ID = data.guildid;
    const URL_SNIPER_SELF_TOKEN = data.vanitytoken;
    const find = {
        vanity_url_code: vanity
    };

    try {
        const response = await axios.patch(
            `https://discord.com/api/v10/guilds/${SNIPER_GUILD_ID}/vanity-url`,
            { code: find.vanity_url_code },
            {
                headers: {
                    Authorization: URL_SNIPER_SELF_TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 200) {
            console.log('Changed vanity URL');
        } else {
            console.error('Failed to change vanity URL');
            throw response;
        }
        return response.data;
    } catch (error) {
        console.error('Failed to change vanity URL');
        throw error;
    }
};

module.exports = { updateVanityURL };