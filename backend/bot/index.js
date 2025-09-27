const { Client, GatewayIntentBits } = require('discord.js');
const Config = require('./bot.json')

const Bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

Bot.login(Config.token)
    .then(() => console.log(`[ BOT ] Logged in successfully ${Bot.user.tag}`))
