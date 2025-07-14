const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');
const Config = require('../../config.json');
const axios = require('axios');
const { Events, AuditLogEvent } = require('discord.js');
const client = require('../../server.js');

// Emoji log kaydetme fonksiyonu
async function logEmojiEvent(emojiData) {
    try {
        // SQL'e kaydet
        const [result] = await db.pool.query(
            'INSERT INTO discord_emoji_log (user_id, username, avatar_url, emoji_id, emoji_name, emoji_url, action, moderator_id, moderator_username, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                emojiData.userId,
                emojiData.username,
                emojiData.avatarUrl,
                emojiData.emojiId,
                emojiData.emojiName,
                emojiData.emojiUrl,
                emojiData.action,
                emojiData.moderatorId || null,
                emojiData.moderatorUsername || null,
                emojiData.reason || null
            ]
        );

        // Webhook'a embed gönder
        const embed = {
            title: emojiData.action === 'create' ? '🟢 Emoji Oluşturuldu' : emojiData.action === 'delete' ? '🔴 Emoji Silindi' : '🟡 Emoji Güncellendi',
            description: `**Emoji:** ${emojiData.emojiName} (${emojiData.emojiId})\n**Kullanıcı:** ${emojiData.username} (${emojiData.userId})`,
            color: emojiData.action === 'create' ? 0x00FF00 : emojiData.action === 'delete' ? 0xFF0000 : 0xFFFF00,
            thumbnail: {
                url: emojiData.emojiUrl
            },
            fields: [],
            timestamp: new Date()
        };

        if (emojiData.moderatorUsername) {
            embed.fields.push({
                name: 'Moderatör',
                value: `${emojiData.moderatorUsername} (${emojiData.moderatorId})`,
                inline: true
            });
        }

        if (emojiData.reason) {
            embed.fields.push({
                name: 'Sebep',
                value: emojiData.reason,
                inline: true
            });
        }

        const webhookData = {
            username: Config.discord.log.WebhookName,
            avatar_url: Config.discord.log.WebhookLogoURL,
            embeds: [embed]
        };

        await axios.post(Config.discord.log.emojiWebhookURL, webhookData);
        console.log(`Emoji logu kaydedildi: ${emojiData.action} - ${emojiData.emojiName} - ${emojiData.username}`);

    } catch (error) {
        console.error('Emoji logu kaydedilirken hata:', error);
    }
}

// Discord event listeners
client.on(Events.GuildEmojiCreate, async (emoji) => {
    try {
        console.log('Emoji oluşturuldu:', emoji.name);

        // Audit log'ları al
        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiCreate,
            limit: 1
        });

        const emojiLog = auditLogs.entries.first();
        const moderator = emojiLog ? emojiLog.executor : null;

        await logEmojiEvent({
            userId: moderator?.id || 'Unknown',
            username: moderator?.username || 'Unknown',
            avatarUrl: moderator?.displayAvatarURL({ dynamic: true }) || `https://cdn.discordapp.com/embed/avatars/0.png`,
            emojiId: emoji.id,
            emojiName: emoji.name,
            emojiUrl: emoji.url,
            action: 'create',
            moderatorId: moderator?.id || null,
            moderatorUsername: moderator?.username || null,
            reason: emojiLog?.reason || null
        });

    } catch (error) {
        console.error('GuildEmojiCreate event hatası:', error);
    }
});

client.on(Events.GuildEmojiDelete, async (emoji) => {
    try {
        console.log('Emoji silindi:', emoji.name);

        // Audit log'ları al
        const auditLogs = await emoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiDelete,
            limit: 1
        });

        const emojiLog = auditLogs.entries.first();
        const moderator = emojiLog ? emojiLog.executor : null;

        await logEmojiEvent({
            userId: moderator?.id || 'Unknown',
            username: moderator?.username || 'Unknown',
            avatarUrl: moderator?.displayAvatarURL({ dynamic: true }) || `https://cdn.discordapp.com/embed/avatars/0.png`,
            emojiId: emoji.id,
            emojiName: emoji.name,
            emojiUrl: emoji.url,
            action: 'delete',
            moderatorId: moderator?.id || null,
            moderatorUsername: moderator?.username || null,
            reason: emojiLog?.reason || null
        });

    } catch (error) {
        console.error('GuildEmojiDelete event hatası:', error);
    }
});

client.on(Events.GuildEmojiUpdate, async (oldEmoji, newEmoji) => {
    try {
        console.log('Emoji güncellendi:', oldEmoji.name, '->', newEmoji.name);

        // Audit log'ları al
        const auditLogs = await newEmoji.guild.fetchAuditLogs({
            type: AuditLogEvent.EmojiUpdate,
            limit: 1
        });

        const emojiLog = auditLogs.entries.first();
        const moderator = emojiLog ? emojiLog.executor : null;

        await logEmojiEvent({
            userId: moderator?.id || 'Unknown',
            username: moderator?.username || 'Unknown',
            avatarUrl: moderator?.displayAvatarURL({ dynamic: true }) || `https://cdn.discordapp.com/embed/avatars/0.png`,
            emojiId: newEmoji.id,
            emojiName: newEmoji.name,
            emojiUrl: newEmoji.url,
            action: 'update',
            moderatorId: moderator?.id || null,
            moderatorUsername: moderator?.username || null,
            reason: emojiLog?.reason || null
        });

    } catch (error) {
        console.error('GuildEmojiUpdate event hatası:', error);
    }
});

// API endpoint - Emoji loglarını getir
router.get('/', async (req, res) => {
    try {
        const { action, user_id, emoji_id, limit = 100 } = req.query;
        
        let sql = 'SELECT * FROM discord_emoji_log WHERE 1=1';
        const params = [];

        if (action && ['create', 'delete', 'update'].includes(action)) {
            sql += ' AND action = ?';
            params.push(action);
        }

        if (user_id) {
            sql += ' AND user_id = ?';
            params.push(user_id);
        }

        if (emoji_id) {
            sql += ' AND emoji_id = ?';
            params.push(emoji_id);
        }

        sql += ' ORDER BY event_time DESC LIMIT ?';
        params.push(parseInt(limit));

        const [rows] = await db.pool.query(sql, params);

        const logs = rows.map(row => ({
            id: row.id,
            emoji: {
                id: row.emoji_id,
                name: row.emoji_name,
                url: row.emoji_url
            },
            user: {
                id: row.user_id,
                username: row.username,
                avatar_url: row.avatar_url
            },
            action: row.action,
            moderator: row.moderator_id ? {
                id: row.moderator_id,
                username: row.moderator_username
            } : null,
            reason: row.reason,
            event_time: row.event_time,
            formatted_date: new Date(row.event_time).toLocaleString('tr-TR')
        }));

        res.json({
            success: true,
            logs: logs,
            total: logs.length
        });

    } catch (error) {
        console.error('Emoji logları alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Emoji logları alınırken hata oluştu'
        });
    }
});

// Manuel emoji log ekleme endpoint'i
router.post('/', async (req, res) => {
    try {
        const { userId, username, avatarUrl, emojiId, emojiName, emojiUrl, action, moderatorId, moderatorUsername, reason } = req.body;

        if (!userId || !username || !emojiId || !emojiName || !action) {
            return res.status(400).json({
                success: false,
                error: 'Gerekli alanlar eksik'
            });
        }

        await logEmojiEvent({
            userId,
            username,
            avatarUrl: avatarUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`,
            emojiId,
            emojiName,
            emojiUrl: emojiUrl || 'https://cdn.discordapp.com/embed/avatars/0.png',
            action,
            moderatorId,
            moderatorUsername,
            reason
        });

        res.json({
            success: true,
            message: 'Emoji logu başarıyla kaydedildi'
        });

    } catch (error) {
        console.error('Manuel emoji log eklenirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Emoji logu eklenirken hata oluştu'
        });
    }
});

// Emoji log istatistikleri
router.get('/stats', async (req, res) => {
    try {
        const [totalLogs] = await db.pool.query('SELECT COUNT(*) as total FROM discord_emoji_log');
        const [actionStats] = await db.pool.query('SELECT action, COUNT(*) as count FROM discord_emoji_log GROUP BY action');
        const [recentLogs] = await db.pool.query('SELECT COUNT(*) as count FROM discord_emoji_log WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');
        const [topEmojis] = await db.pool.query('SELECT emoji_name, COUNT(*) as count FROM discord_emoji_log GROUP BY emoji_name ORDER BY count DESC LIMIT 10');

        res.json({
            success: true,
            stats: {
                total: totalLogs[0].total,
                last24h: recentLogs[0].count,
                byAction: actionStats,
                topEmojis: topEmojis
            }
        });

    } catch (error) {
        console.error('Emoji log istatistikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

module.exports = router; 