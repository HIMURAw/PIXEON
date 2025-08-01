import { Client } from 'discord.js'
import fs from 'fs'
import path from 'path'

export function loadEvents(client: Client) {
    const eventFiles = fs.readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.ts'))

    for (const file of eventFiles) {
        const event = require(`../events/${file}`).default

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    }
}
