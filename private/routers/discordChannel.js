const express = require('express');
const router = express.Router();
const { client } = require('../discord');
const Config = require('../config');

// Duyuru kanalı mesajlarını getir
router.get('/announcements', async (req, res) => {
    try {
        const channel = await client.channels.fetch(Config.discord.AnnoncementChannel);

        if (!channel) {
            return res.status(404).json({ error: 'Duyuru kanalı bulunamadı' });
        }

        // Son 50 mesajı al
        const messages = await channel.messages.fetch({ limit: 50 });

        // Mesajları formatla
        const formattedMessages = messages.map(message => ({
            id: message.id,
            content: message.content,
            author: {
                id: message.author.id,
                username: message.author.username,
                avatar: message.author.displayAvatarURL({ dynamic: true }),
                isBot: message.author.bot
            },
            timestamp: message.createdAt,
            edited: message.editedAt ? true : false,
            attachments: message.attachments.map(attachment => ({
                url: attachment.url,
                name: attachment.name,
                contentType: attachment.contentType
            })),
            embeds: message.embeds.map(embed => ({
                title: embed.title,
                description: embed.description,
                url: embed.url,
                color: embed.color,
                image: embed.image?.url,
                thumbnail: embed.thumbnail?.url
            }))
        }));

        res.status(200).json({
            channelName: channel.name,
            channelType: channel.type,
            messageCount: formattedMessages.length,
            messages: formattedMessages,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Duyuru kanalı mesajları alınırken hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Tüm kanalları getir
router.get('/channels', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Sunucu bulunamadı' });
        }

        const channels = guild.channels.cache.map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
            parent: channel.parent ? {
                id: channel.parent.id,
                name: channel.parent.name
            } : null,
            topic: channel.topic,
            nsfw: channel.nsfw,
            lastMessageId: channel.lastMessageId,
            createdAt: channel.createdAt,
            isAnnouncementChannel: channel.id === Config.discord.AnnoncementChannel,
            isVoiceChannel: channel.id === Config.discord.voicechannel
        }));

        res.status(200).json({
            serverName: guild.name,
            channelCount: channels.length,
            channels: channels,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Kanallar alınırken hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
