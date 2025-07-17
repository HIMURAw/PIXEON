const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    let eventFiles = [];
    if (fs.existsSync(eventsPath)) {
        eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
        if (eventFiles.length === 0) {
            console.warn('\x1b[35m[PX-Ticket]\x1b[0m Event klasörü boş:', eventsPath);
        }
    } else {
        console.error('\x1b[41m[PX-Ticket] HATA\x1b[0m', eventsPath);
        return;
    }

    for (const file of eventFiles) {
        const event = require(path.join(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => {
                event.execute(...args, client);
            });
        } else {
            client.on(event.name, (...args) => {
                event.execute(...args, client);
            });
        }
    }
};
