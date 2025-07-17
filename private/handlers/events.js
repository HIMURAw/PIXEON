const path = require('path');
const fs = require('fs');

function loadEvents(client) {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const eventModule = require(path.join(eventsPath, file));
        // Dizi olarak export edilen eventler (örn. voiceStateUpdate.js)
        if (Array.isArray(eventModule)) {
            for (const event of eventModule) {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            }
        } else {
            const event = eventModule;
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

module.exports = { loadEvents };
