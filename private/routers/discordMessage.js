const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');
const Config = require('../../config.json');
const axios = require('axios');
const client = require('../../server.js');
const { Events } = require('discord.js');

// Mesaj log kaydetme fonksiyonu
async function logMessageEvent(messageData) {
    try {
        console.log('logMessageEvent çağrıldı:', messageData.action, messageData.messageId);
        
        // SQL'e kaydet
        const [result] = await db.pool.query(
            'INSERT INTO discord_message_log (message_id, channel_id, channel_name, user_id, username, avatar_url, content, action, attachments_count, mentions_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                messageData.messageId,
                messageData.channelId,
                messageData.channelName,
                messageData.userId,
                messageData.username,
                messageData.avatarUrl,
                messageData.content,
                messageData.action,
                messageData.attachmentsCount || 0,
                messageData.mentionsCount || 0
            ]
        );

        console.log('Veritabanına kaydedildi, ID:', result.insertId);

        // Webhook'a embed gönder
        const actionEmojis = {
            'create': '📝',
            'edit': '✏️',
            'delete': '🗑️',
            'bulk_delete': '🗑️🗑️'
        };

        const actionColors = {
            'create': 0x00FF00,
            'edit': 0xFFFF00,
            'delete': 0xFF0000,
            'bulk_delete': 0xFF6600
        };

        const embed = {
            title: `${actionEmojis[messageData.action]} Mesaj ${messageData.action === 'create' ? 'Oluşturuldu' : messageData.action === 'edit' ? 'Düzenlendi' : messageData.action === 'delete' ? 'Silindi' : 'Toplu Silindi'}`,
            description: `**Kullanıcı:** ${messageData.username} (${messageData.userId})\n**Kanal:** ${messageData.channelName} (${messageData.channelId})`,
            color: actionColors[messageData.action],
            thumbnail: {
                url: messageData.avatarUrl
            },
            fields: [],
            timestamp: new Date()
        };

        if (messageData.content && messageData.content.length > 0) {
            const contentPreview = messageData.content.length > 1024 
                ? messageData.content.substring(0, 1021) + '...' 
                : messageData.content;
            
            embed.fields.push({
                name: 'Mesaj İçeriği',
                value: contentPreview,
                inline: false
            });
        }

        if (messageData.attachmentsCount > 0) {
            embed.fields.push({
                name: 'Ekler',
                value: `${messageData.attachmentsCount} dosya`,
                inline: true
            });
        }

        if (messageData.mentionsCount > 0) {
            embed.fields.push({
                name: 'Etiketler',
                value: `${messageData.mentionsCount} kullanıcı`,
                inline: true
            });
        }

        if (messageData.messageId) {
            embed.fields.push({
                name: 'Mesaj ID',
                value: messageData.messageId,
                inline: true
            });
        }

        const webhookData = {
            username: Config.discord.log.WebhookName,
            avatar_url: Config.discord.log.WebhookLogoURL,
            embeds: [embed]
        };

        console.log('Webhook gönderiliyor...');
        await axios.post(Config.discord.log.MessageWebhookURL, webhookData);
        console.log(`Mesaj logu kaydedildi: ${messageData.action} - ${messageData.username} - ${messageData.channelName}`);

    } catch (error) {
        console.error('Mesaj logu kaydedilirken hata:', error);
        console.error('Hata detayı:', error.message);
        if (error.response) {
            console.error('Webhook response:', error.response.data);
        }
    }
}

// Discord mesaj event listeners
client.on(Events.MessageCreate, async (message) => {
    try {
        if (message.author.bot) return;
        await logMessageEvent({
            messageId: message.id,
            channelId: message.channel.id,
            channelName: message.channel.name,
            userId: message.author.id,
            username: message.author.username,
            avatarUrl: message.author.displayAvatarURL({ dynamic: true }),
            content: message.content,
            action: 'create',
            attachmentsCount: message.attachments.size,
            mentionsCount: message.mentions.users.size
        });
    } catch (error) {
        console.error('MessageCreate event hatası:', error);
    }
});

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    try {
        if (newMessage.author.bot) return;
        if (oldMessage.content === newMessage.content) return;
        await logMessageEvent({
            messageId: newMessage.id,
            channelId: newMessage.channel.id,
            channelName: newMessage.channel.name,
            userId: newMessage.author.id,
            username: newMessage.author.username,
            avatarUrl: newMessage.author.displayAvatarURL({ dynamic: true }),
            content: `**Eski:** ${oldMessage.content}\n**Yeni:** ${newMessage.content}`,
            action: 'edit',
            attachmentsCount: newMessage.attachments.size,
            mentionsCount: newMessage.mentions.users.size
        });
    } catch (error) {
        console.error('MessageUpdate event hatası:', error);
    }
});

client.on(Events.MessageDelete, async (message) => {
    try {
        console.log('MessageDelete event tetiklendi:', message.id);
        
        // Bot mesajlarını loglama
        if (message.author?.bot) {
            console.log('Bot mesajı silindi, loglanmıyor');
            return;
        }

        // Mesaj verilerini hazırla
        const messageData = {
            messageId: message.id,
            channelId: message.channel.id,
            channelName: message.channel.name,
            userId: message.author?.id || 'Bilinmeyen',
            username: message.author?.username || 'Bilinmeyen Kullanıcı',
            avatarUrl: message.author?.displayAvatarURL({ dynamic: true }) || 'https://cdn.discordapp.com/embed/avatars/0.png',
            content: message.content || 'İçerik bulunamadı',
            action: 'delete',
            attachmentsCount: message.attachments?.size || 0,
            mentionsCount: message.mentions?.users?.size || 0
        };

        console.log('Mesaj silme verileri:', messageData);
        await logMessageEvent(messageData);
        console.log('Mesaj silme logu başarıyla kaydedildi');
        
    } catch (error) {
        console.error('MessageDelete event hatası:', error);
    }
});

client.on(Events.MessageBulkDelete, async (messages) => {
    try {
        for (const [messageId, message] of messages) {
            if (message.author?.bot) continue;
            await logMessageEvent({
                messageId: message.id,
                channelId: message.channel.id,
                channelName: message.channel.name,
                userId: message.author?.id || 'Bilinmeyen',
                username: message.author?.username || 'Bilinmeyen Kullanıcı',
                avatarUrl: message.author?.displayAvatarURL({ dynamic: true }) || 'https://cdn.discordapp.com/embed/avatars/0.png',
                content: message.content || 'İçerik bulunamadı',
                action: 'bulk_delete',
                attachmentsCount: message.attachments?.size || 0,
                mentionsCount: message.mentions?.users?.size || 0
            });
        }
    } catch (error) {
        console.error('MessageBulkDelete event hatası:', error);
    }
});

// API endpoint - Mesaj loglarını getir
router.get('/', async (req, res) => {
    try {
        const { action, user_id, channel_id, limit = 100 } = req.query;
        let sql = 'SELECT * FROM discord_message_log WHERE 1=1';
        const params = [];
        if (action && ['create', 'edit', 'delete', 'bulk_delete'].includes(action)) {
            sql += ' AND action = ?';
            params.push(action);
        }
        if (user_id) {
            sql += ' AND user_id = ?';
            params.push(user_id);
        }
        if (channel_id) {
            sql += ' AND channel_id = ?';
            params.push(channel_id);
        }
        sql += ' ORDER BY event_time DESC LIMIT ?';
        params.push(parseInt(limit));
        const [rows] = await db.pool.query(sql, params);
        const logs = rows.map(row => ({
            id: row.id,
            message_id: row.message_id,
            channel: {
                id: row.channel_id,
                name: row.channel_name
            },
            user: {
                id: row.user_id,
                username: row.username,
                avatar_url: row.avatar_url
            },
            content: row.content,
            action: row.action,
            attachments_count: row.attachments_count,
            mentions_count: row.mentions_count,
            event_time: row.event_time,
            formatted_date: new Date(row.event_time).toLocaleString('tr-TR')
        }));
        res.json({
            success: true,
            logs: logs,
            total: logs.length
        });
    } catch (error) {
        console.error('Mesaj logları alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Mesaj logları alınırken hata oluştu'
        });
    }
});

// Manuel mesaj log ekleme endpoint'i
router.post('/', async (req, res) => {
    try {
        const { messageId, channelId, channelName, userId, username, avatarUrl, content, action, attachmentsCount, mentionsCount } = req.body;
        if (!messageId || !channelId || !channelName || !userId || !username || !action) {
            return res.status(400).json({
                success: false,
                error: 'Gerekli alanlar eksik'
            });
        }
        await logMessageEvent({
            messageId,
            channelId,
            channelName,
            userId,
            username,
            avatarUrl: avatarUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`,
            content: content || '',
            action,
            attachmentsCount: attachmentsCount || 0,
            mentionsCount: mentionsCount || 0
        });
        res.json({
            success: true,
            message: 'Mesaj logu başarıyla kaydedildi'
        });
    } catch (error) {
        console.error('Manuel mesaj log eklenirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Mesaj logu eklenirken hata oluştu'
        });
    }
});

// Mesaj log istatistikleri
router.get('/stats', async (req, res) => {
    try {
        const [totalLogs] = await db.pool.query('SELECT COUNT(*) as total FROM discord_message_log');
        const [actionStats] = await db.pool.query('SELECT action, COUNT(*) as count FROM discord_message_log GROUP BY action');
        const [recentLogs] = await db.pool.query('SELECT COUNT(*) as count FROM discord_message_log WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');
        const [channelStats] = await db.pool.query('SELECT channel_name, COUNT(*) as count FROM discord_message_log GROUP BY channel_name ORDER BY count DESC LIMIT 10');
        res.json({
            success: true,
            stats: {
                total: totalLogs[0].total,
                last24h: recentLogs[0].count,
                byAction: actionStats,
                byChannel: channelStats
            }
        });
    } catch (error) {
        console.error('Mesaj log istatistikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

module.exports = router; 