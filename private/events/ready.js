const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`\x1b[34m[PX-Main]\x1b[0m Discord botuna ${client.user.displayName} olarak giriş sağlandı.`);
        // Komutları Discord API'ye kaydetme işlemi kaldırıldı.
    }
}; 