import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Bot çalıştı: ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
