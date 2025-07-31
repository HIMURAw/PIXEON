import { Client, GatewayIntentBits } from 'discord.js';
const Config = require('config.ts');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Bot çalıştı: ${client.user?.tag}`);
});

client.login(Config.discord.TOKEN);
