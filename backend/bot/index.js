const { Client, GatewayIntentBits } = require('discord.js');
const Config = require('../../config.js')

const Bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

Bot.login(Config.discord.token)
    .then(() => console.log(`[ BOT ] Logged in successfully ${Bot.user.tag}`))
