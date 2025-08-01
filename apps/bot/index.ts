import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { CustomClient } from './src/types'

const Config = require('./config.ts')

import { loadCommands } from './src/handlers/commandHandler'
import { loadEvents } from './src/handlers/eventHandler'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
}) as CustomClient;

client.commands = new Collection()

loadCommands(client)
loadEvents(client)

export default client

client.login(Config.discord.token)
