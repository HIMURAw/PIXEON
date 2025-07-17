const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Config = require('../../config.js');
const loadEvents = require('./handlers/eventHandler');
const { loadCommands, handleInteraction, registerCommands } = require('./handlers/commandHandler');

const token = Config.discord.guardBot.guard_bot_token;
const clientId = Config.discord.guardBot.guard_client_id;
const guildId = Config.discord.guidid;


// Create Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Collections for commands and events
client.commands = new Collection();
client.events = new Collection();

// Bot ready event
client.once('ready', () => {
    console.log(`\x1b[32m[PX-Guard]\x1b[0m ${client.user.displayName} olarak giriş yapıldı!`);
    
    // Set bot status
    client.user.setActivity('PX Development', { type: 'WATCHING' });
    
    // Register commands after bot is ready
    registerCommands(client);
});

// Error handling
client.on('error', error => {
    console.error('\x1b[31m[PX-Guard]\x1b[0m Bot hatası:', error);
});

process.on('unhandledRejection', error => {
    console.error('\x1b[31m[PX-Guard]\x1b[0m İşlenmeyen Promise reddi:', error);
});

process.on('uncaughtException', error => {
    console.error('\x1b[31m[PX-Guard]\x1b[0m Yakalanmamış istisna:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\x1b[33m[PX-Guard]\x1b[0m Bot kapatılıyor...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\x1b[33m[PX-Guard]\x1b[0m Bot kapatılıyor...');
    client.destroy();
    process.exit(0);
});

// Bot otomatik başlatma (Ticket sistemi gibi)
(async () => {
    try {
        // Load commands and events
        loadCommands(client);
        loadEvents(client);
        
        // Setup interaction handler
        handleInteraction(client);
        
        // Login to Discord
        await client.login(token);
    } catch (error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Bot başlatma hatası:', error);
    }
})();

// Export for use in other files
module.exports = {
    client
};
