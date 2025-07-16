const express = require('express');
const router = express.Router();
const client = require('../../server.js');
const Config = require('../../config.js');

// Duyuru kanalı mesajlarını getir
router.get('/discord/comment', async (req, res) => {
    try {

        const channel = await client.channels.fetch(Config.discord.commaentChannel);

        if (!channel) {
            return res.status(404).json({ error: 'Yorum kanalı bulunamadı' });
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
        console.error('Yorum kanalı mesajları alınırken hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;