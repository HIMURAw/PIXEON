const { Client, GatewayIntentBits, REST, Routes, MessageFlags } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const eventHandlers = require("./src/handlers/eventHandler.js");
const { commandMap, handleCommand } = require("./src/handlers/commandHandler.js");
const Config = require('../../config.js');
const token = Config.discord.ticketBot.ticket_bot_token;
const fs = require('fs');
const path = require('path');
const { createTranscript } = require('discord-html-transcripts');
const express = require('express');
const cors = require('cors');
const router = express.Router();

(async () => {
    try {
        const commands = [];
        const commandsPath = path.join(__dirname, 'src/commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            if (command.data) {
                commands.push(command.data.toJSON());
            }
        }
        const rest = new REST({ version: '10' }).setToken(token);
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(Config.discord.ticketBot.clientId, Config.discord.guidid),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Ticket botu için yeni bir Discord client oluştur
const ticketBot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates // Ses olaylarını dinlemek için
    ]
});

ticketBot.openTickets = new Set();
ticketBot.commands = commandMap;
eventHandlers(ticketBot);

function joinVoice() {
    let channel = ticketBot.channels.cache.get(Config.discord.voicechannel);
    if (!channel) return console.error('[Bot] Ses kanalı bulunamadı!');
    // Zaten bağlıysa tekrar bağlanma
    const existing = getVoiceConnection(channel.guild.id);
    if (existing && existing.joinConfig.channelId === channel.id) return;
    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
    console.log('[Bot] Ses kanalına bağlandı:', channel.name);
}

ticketBot.on('ready', () => {
    setTimeout(joinVoice, 2000); // Bot hazır olduğunda sese gir
});

ticketBot.on('voiceStateUpdate', (oldState, newState) => {
    // Eğer bot sesten atıldıysa veya bağlantı koptuysa tekrar gir
    const channelId = Config.discord.voicechannel;
    if (newState.id === ticketBot.user.id) {
        if (!newState.channelId || newState.channelId !== channelId) {
            setTimeout(joinVoice, 2000);
        }
    }
});
ticketBot.once('ready', () => {
    console.log(`[TicketBot] Başarıyla giriş yaptı: ${ticketBot.user.tag}`);
    setTimeout(joinVoice, 2000); // Bot hazır olduğunda sese gir
});

// Ticket silme butonu event handler
const logDir = path.join(__dirname, '../../public/log');

// Discord event handler'ı ekle
// (ticketBot.on('interactionCreate', ...) ile buton kontrolü)
ticketBot.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'ticketisil') {
        await interaction.reply({
            content: 'Ticket transcript hazırlanıyor ve kanal silinecek...',
            flags: MessageFlags.Ephemeral
        });
        try {
            // Transcript oluştur
            const transcript = await createTranscript(interaction.channel, {
                limit: -1,
                returnType: 'buffer',
                saveImages: true,
                poweredBy: false,
                filename: `${interaction.channel.name}-${interaction.channel.id}.html`,
            });
            // /public/log klasörüne kaydet
            if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
            const filePath = path.join(logDir, `${interaction.channel.name}-${interaction.channel.id}.html`);
            fs.writeFileSync(filePath, transcript);
            // Discord'da log kanalına gönder
            const logChannelId = Config.discord.log && Config.discord.log.transcriptsChannelId;
            if (logChannelId) {
                const logChannel = ticketBot.channels.cache.get(logChannelId);
                if (logChannel) {
                    await logChannel.send({
                        content: `Ticket transcript for <#${interaction.channel.id}>`,
                        files: [filePath],
                    });
                }
            }
        } catch (err) {
            console.error('Transcript oluşturulamadı:', err);
        }
        setTimeout(() => {
            interaction.channel.delete().catch(() => {});
        }, 2500);
    }
});

// /tickets endpointi: belirli bir kategori altındaki kanalları listeler
router.get('/tickets', async (req, res) => {
    try {
        const guild = ticketBot.guilds.cache.get(Config.discord.guildId || Config.discord.guidid);
        if (!guild) {
            return res.status(404).send('Sunucu bulunamadı.');
        }
        // Kategori ID'si configten alınmalı
        const categoryId = Config.discord.ticketBot.catagory || Config.discord.ticketBot.category || 'KATEGORI_ID';
        const category = guild.channels.cache.get(categoryId);
        if (!category || category.type !== 4) { // 4 = ChannelType.GuildCategory
            return res.status(404).send('Kategori bulunamadı veya geçersiz kanal türü.');
        }
        const channels = Array.from(category.children?.cache?.values() || []);
        let html = `
            <html>
            <head>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #36393F; color: #DCDDDE; margin: 0; padding: 0; }
                    h1 { color: #ffffff; padding: 10px; background-color: #2F3136; margin: 0; text-align: center; }
                    button { background-color: #7289DA; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px; }
                    button:hover { background-color: #5B6EAE; }
                </style>
            </head>
            <body>
                <h1>Kanallar</h1>
                ${channels.map(channel => `
                    <button onclick="window.location.href='/messages/${channel.id}'">${channel.name}</button><br>
                `).join('')}
            </body>
            </html>
        `;
        res.send(html);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).send('Sunucu hatası');
    }
});

// /messages/:channelId endpointi: kanal mesajlarını gösterir
router.get('/messages/:channelId', async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const channel = ticketBot.channels.cache.get(channelId);
        if (!channel) {
            return res.status(404).send('Kanal bulunamadı.');
        }
        let messages = await channel.messages.fetch({ limit: 10 });
        messages = Array.from(messages.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        let html = `
            <html>
            <head>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #36393F; color: #DCDDDE; margin: 0; padding: 0; }
                    h1 { color: #ffffff; padding: 10px; background-color: #2F3136; margin: 0; text-align: center; }
                    .message { padding: 10px; border-bottom: 1px solid #2F3136; display: flex; align-items: flex-start; margin: 10px 0; }
                    .avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; }
                    .content { background-color: #2F3136; border-radius: 5px; padding: 10px; max-width: 80%; }
                    .author { font-weight: bold; }
                    .timestamp { color: #72767D; font-size: 0.9em; }
                    .embed { background-color: #2F3136; border: 1px solid #444; border-radius: 5px; padding: 10px; margin-top: 10px; }
                    .embed-title { font-weight: bold; margin-bottom: 5px; }
                    .embed-description { margin-bottom: 10px; }
                    .embed-footer { font-size: 0.8em; color: #72767D; }
                    .buttons { text-align: center; margin-bottom: 20px; }
                    .media { margin-top: 10px; }
                    .media img { max-width: 100%; height: auto; border-radius: 5px; }
                    .media video { max-width: 100%; height: auto; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>${channel.name} Mesajları</h1>
                <div class="buttons">
                    <button onclick="handleButtonClick('rename')">İsim Değiştir</button>
                    <button onclick="handleButtonClick('save')">Ticket Kaydet</button>
                    <button onclick="handleButtonClick('close')">Yenile</button>
                    <button onclick="handleButtonClick('sendMessage')">Mesaj Gönder</button>
                </div>
                ${messages.map(msg => {
                    const user = msg.author;
                    const profilePic = user.displayAvatarURL({ format: 'png', dynamic: true });
                    const timestamp = new Date(msg.createdTimestamp).toLocaleString();
                    let embedsHtml = '';
                    if (msg.embeds.length > 0) {
                        embedsHtml = msg.embeds.map(embed => `
                            <div class="embed">
                                ${embed.title ? `<div class="embed-title">${embed.title}</div>` : ''}
                                ${embed.description ? `<div class="embed-description">${embed.description}</div>` : ''}
                                ${embed.footer ? `<div class="embed-footer">${embed.footer.text}</div>` : ''}
                            </div>
                        `).join('');
                    }
                    let mediaHtml = '';
                    if (msg.attachments.size > 0) {
                        mediaHtml = Array.from(msg.attachments.values()).map(attachment => {
                            if (attachment.height) {
                                return `<img src="${attachment.url}" alt="Media" class="media" />`;
                            } else if (attachment.name.endsWith('.mp4') || attachment.name.endsWith('.webm')) {
                                return `<video controls class="media">
                                            <source src="${attachment.url}" type="video/${attachment.name.split('.').pop()}" />
                                            Tarayıcınız video etiketini desteklemiyor.
                                        </video>`;
                            } else {
                                return `<a href="${attachment.url}" download="${attachment.name}" style="color: #7289DA; display: block; margin-top: 10px;">${attachment.name}</a>`;
                            }
                        }).join('');
                    }
                    return `
                        <div class="message">
                            <img src="${profilePic}" alt="${user.username}'s avatar" class="avatar"/>
                            <div class="content">
                                <div class="author">${user.tag} <span class="timestamp">(${timestamp})</span></div>
                                <p>${msg.content}</p>
                                ${embedsHtml}
                                ${mediaHtml}
                            </div>
                        </div>
                    `;
                }).join('')}
                <script>
                    async function handleButtonClick(action) {
                        let url;
                        let message;
                        switch (action) {
                            case 'rename':
                                const newName = prompt("Yeni kanal adını girin:");
                                if (newName) {
                                    url = '/rename-channel';
                                    await fetch(url, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ channelId: '${channelId}', name: newName })
                                    });
                                }
                                break;
                            case 'save':
                                url = '/save-ticket';
                                await fetch(url, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ channelId: '${channelId}' })
                                });
                                break;
                            case 'close':
                                window.location.reload();
                                break;
                            case 'sendMessage':
                                message = prompt("Göndermek istediğiniz mesajı girin:");
                                if (message) {
                                    url = '/send-message';
                                    await fetch(url, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ channelId: '${channelId}', message: message })
                                    });
                                }
                                break;
                        }
                        window.location.reload();
                    }
                </script>
            </body>
            </html>
        `;
        res.send(html);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Sunucu hatası');
    }
});

// Kanal ismini değiştir
router.post('/rename-channel', async (req, res) => {
    try {
        const { channelId, name } = req.body;
        const channel = ticketBot.channels.cache.get(channelId);
        if (!channel || channel.type === 4) { // 4 = ChannelType.GuildCategory
            return res.status(400).send('Geçersiz kanal ID\'si veya kategori ID\'si.');
        }
        await channel.setName(name);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error renaming channel:', error);
        res.status(500).send('Sunucu hatası');
    }
});

// Kanala mesaj gönder
router.post('/send-message', async (req, res) => {
    try {
        const { channelId, message } = req.body;
        const channel = ticketBot.channels.cache.get(channelId);
        if (!channel || channel.type !== 0) { // 0 = ChannelType.GuildText
            return res.status(400).send('Geçersiz kanal ID\'si veya kategori ID\'si.');
        }
        await channel.send(message);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Mesaj gönderilemedi.');
    }
});

// Ticket transcript oluştur ve log kanalına gönder
router.post('/save-ticket', async (req, res) => {
    try {
        const { channelId } = req.body;
        const channel = ticketBot.channels.cache.get(channelId);
        if (!channel || channel.type !== 0) { // 0 = ChannelType.GuildText
            return res.status(400).send('Geçersiz kanal ID\'si veya kategori ID\'si.');
        }
        const guild = ticketBot.guilds.cache.get(Config.discord.guildId || Config.discord.guidid);
        if (!guild) {
            return res.status(404).send('Sunucu bulunamadı.');
        }
        const transcript = await createTranscript(channel, {
            limit: -1,
            returnType: 'buffer',
            saveImages: true,
            poweredBy: false,
            filename: `${channel.name}-${channel.id}.html`,
        });
        // /public/log klasörüne kaydet
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        const filePath = path.join(logDir, `${channel.name}-${channel.id}.html`);
        fs.writeFileSync(filePath, transcript);
        // Discord'da log kanalına gönder
        const logChannelId = Config.discord.log && Config.discord.log.transcriptsChannelId;
        if (logChannelId) {
            const logChannel = ticketBot.channels.cache.get(logChannelId);
            if (logChannel) {
                await logChannel.send({
                    content: `Ticket transcript for <#${channel.id}>`,
                    files: [filePath],
                });
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error closing ticket:', error);
        res.status(500).send('Sunucu hatası');
    }
});

module.exports = router;

if (!token) {
    console.error('Ticket bot tokenı config.js içinde bulunamadı!');
    process.exit(1);
}
ticketBot.login(token);

