import { ClientEvents } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { CustomClient } from '../types';

export function loadEvents(client: CustomClient) {
    const eventFiles = fs.readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.ts'))

    for (const file of eventFiles) {
        const event = require(`../events/${file}`).default

        if (event.once) {
            client.once(event.name, ((...args: any[]) => event.execute(...args)) as any);
        } else {
            client.on(event.name, ((...args: any[]) => event.execute(...args)) as any);
        }
    }
}
