const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, Events, Collection, REST, Routes } = require('discord.js');
const Config = require('./config.json');
const { createAdminsTable } = require('./private/DB/models/userModel');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const { pool, checkConnection } = require('./private/DB/connect');

const app = express();

const port = Config.port || 3000;

// Discord Client oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildBans,
    ]
});

// Client'ı hemen export et
module.exports = client;

// Discord bot token
const token = Config.discord.token;

// Komutları yükle
console.log('\n=== Komut Yükleme Başladı ===');
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'private', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('🔄 Starting command registration process...');

const commands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    console.log(`\nYükleniyor: ${file}`);

    try {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`✅ ${command.data.name} komutu başarıyla yüklendi`);
            console.log(`   Açıklama: ${command.data.description}`);
        } else {
            console.log(`❌ ${file} dosyasında gerekli özellikler eksik`);
            console.log('   Gerekli özellikler: data ve execute');
        }
    } catch (error) {
        console.error(`❌ ${file} yüklenirken hata oluştu:`);
        console.error(error);
    }
}

console.log('\n=== Komut Yükleme Tamamlandı ===');
console.log(`Toplam yüklenen komut: ${client.commands.size}`);
console.log('Yüklenen komutlar:', Array.from(client.commands.keys()).join(', '));

// Komutları Discord API'ye kaydet
async function registerCommands() {
    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

        if (!Config.discord.clientId) {
            throw new Error('Client ID is missing in config.json');
        }

        const rest = new REST().setToken(token);
        const data = await rest.put(
            Routes.applicationCommands(Config.discord.clientId),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
        console.log('📝 Registered commands:');
        data.forEach(cmd => {
            console.log(`   - /${cmd.name}: ${cmd.description}`);
        });
    } catch (error) {
        console.error('❌ Error during command registration:', error);
        if (error.code === 50001) {
            console.error('Missing Access: The bot does not have the "applications.commands" scope');
        } else if (error.code === 50013) {
            console.error('Missing Permissions: The bot does not have the required permissions');
        }
    }
}

// Discord bot event handlers
client.once(Events.ClientReady, async () => {
    console.log(`Discord bot logged in as ${client.user.tag}`);
    await registerCommands();
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on(Events.Error, error => {
    console.error('Discord bot error:', error);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

/*

ROUTERS

*/

const loginRouter = require('./private/DB/loginRouter');
const discordUsersRouter = require('./private/routers/discordUsers.js');
const discordServerRouter = require('./private/routers/discordServer.js');
const discordChannelRouter = require('./private/routers/discordChannel.js');

app.use('/api/auth', loginRouter);
app.use('/api/discordUsers', discordUsersRouter);
app.use('/api/discordServer', discordServerRouter);
app.use('/api/discordChannel', discordChannelRouter);




createAdminsTable().catch(console.error);

/*

ROUTERS END

*/


// Discord botu başlat ve ses kanalına bağlan
client.on('ready', () => {
    let channel = client.channels.cache.get(Config.discord.voicechannel);

    const VoiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);

    client.login(Config.discord.token).then(() => {
        console.log('Discord bot başarıyla bağlandı');
    }).catch(error => {
        console.error('Discord bot login error:', error);
    });
});