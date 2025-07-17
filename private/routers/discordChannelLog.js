const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');
const Config = require('../../config.js');
const axios = require('axios');
const client = require('../../server.js');
const { Events, ChannelType, AuditLogEvent } = require('discord.js');

// Channel log kaydetme fonksiyonu
async function logChannelEvent(channelData) {
    try {
        // SQL'e kaydet
        const [result] = await db.pool.query(
            'INSERT INTO discord_channel_log (channel_id, channel_name, channel_type, action, old_name, new_name, moderator_id, moderator_username, reason, event_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                channelData.channelId,
                channelData.channelName,
                channelData.channelType,
                channelData.action,
                channelData.oldName || null,
                channelData.newName || null,
                channelData.moderatorId || null,
                channelData.moderatorUsername || null,
                channelData.reason || null
            ]
        );

        // Webhook'a embed gönder
        const actionEmojis = {
            'create': '📝',
            'delete': '🗑️',
            'update': '✏️',
            'permission_update': '🔐',
            'overwrite_update': '🔒'
        };

        const actionColors = {
            'create': 0x00FF00,
            'delete': 0xFF0000,
            'update': 0xFFFF00,
            'permission_update': 0x0099FF,
            'overwrite_update': 0x9932CC
        };

        const actionTexts = {
            'create': 'Kanal Oluşturuldu',
            'delete': 'Kanal Silindi',
            'update': 'Kanal Güncellendi',
            'permission_update': 'İzinler Güncellendi',
            'overwrite_update': 'Rol İzinleri Güncellendi'
        };

        const channelTypeTexts = {
            [ChannelType.GuildText]: 'Metin Kanalı',
            [ChannelType.GuildVoice]: 'Ses Kanalı',
            [ChannelType.GuildCategory]: 'Kategori',
            [ChannelType.GuildAnnouncement]: 'Duyuru Kanalı',
            [ChannelType.GuildStageVoice]: 'Sahne Kanalı',
            [ChannelType.GuildForum]: 'Forum Kanalı',
            [ChannelType.GuildMedia]: 'Medya Kanalı'
        };

        const embed = {
            title: `${actionEmojis[channelData.action]} ${actionTexts[channelData.action]}`,
            description: `**Kanal:** ${channelData.channelName} (${channelData.channelId})\n**Tür:** ${channelTypeTexts[channelData.channelType] || 'Bilinmeyen'}`,
            color: actionColors[channelData.action],
            fields: [],
            timestamp: new Date()
        };

        if (channelData.moderatorUsername) {
            embed.fields.push({
                name: 'Moderatör',
                value: `${channelData.moderatorUsername} (${channelData.moderatorId})`,
                inline: true
            });
        }

        if (channelData.oldName && channelData.newName && channelData.action === 'update') {
            embed.fields.push({
                name: 'İsim Değişikliği',
                value: `**Eski:** ${channelData.oldName}\n**Yeni:** ${channelData.newName}`,
                inline: false
            });
        }

        if (channelData.oldTopic && channelData.newTopic && channelData.action === 'update') {
            const oldTopicPreview = channelData.oldTopic.length > 50 ? channelData.oldTopic.substring(0, 47) + '...' : channelData.oldTopic;
            const newTopicPreview = channelData.newTopic.length > 50 ? channelData.newTopic.substring(0, 47) + '...' : channelData.newTopic;
            
            embed.fields.push({
                name: 'Konu Değişikliği',
                value: `**Eski:** ${oldTopicPreview}\n**Yeni:** ${newTopicPreview}`,
                inline: false
            });
        }

        if (channelData.oldPosition !== null && channelData.newPosition !== null && channelData.action === 'update') {
            embed.fields.push({
                name: 'Pozisyon Değişikliği',
                value: `**Eski:** ${channelData.oldPosition}\n**Yeni:** ${channelData.newPosition}`,
                inline: true
            });
        }

        const webhookData = {
            username: Config.discord.log.WebhookName,
            avatar_url: Config.discord.log.WebhookLogoURL,
            embeds: [embed]
        };

        await axios.post(Config.discord.log.ChannelWebhookURL, webhookData);
        console.log(`\x1b[38;5;208m📺 [PX-API]\x1b[0m Kanal logu kaydedildi: ${channelData.action} - ${channelData.channelName}`);

    } catch (error) {
        console.error('Kanal logu kaydedilirken hata:', error);
    }
}

// Discord channel event listeners
client.on(Events.ChannelCreate, async (channel) => {
    try {
        // Audit log'ları al
        const auditLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate,
            limit: 1
        });

        const channelLog = auditLogs.entries.first();
        const moderator = channelLog ? channelLog.executor : null;

        await logChannelEvent({
            channelId: channel.id,
            channelName: channel.name,
            channelType: channel.type,
            action: 'create',
            moderatorId: moderator?.id || null,
            moderatorUsername: moderator?.username || null
        });

    } catch (error) {
        console.error('ChannelCreate event hatası:', error);
    }
});

client.on(Events.ChannelDelete, async (channel) => {
    try {
        // Audit log'ları al
        const auditLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete,
            limit: 1
        });

        const channelLog = auditLogs.entries.first();
        const moderator = channelLog ? channelLog.executor : null;

        await logChannelEvent({
            channelId: channel.id,
            channelName: channel.name,
            channelType: channel.type,
            action: 'delete',
            moderatorId: moderator?.id || null,
            moderatorUsername: moderator?.username || null
        });

    } catch (error) {
        console.error('ChannelDelete event hatası:', error);
    }
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    try {
        // Audit log'ları al
        const auditLogs = await newChannel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelUpdate,
            limit: 1
        });

        const channelLog = auditLogs.entries.first();
        const moderator = channelLog ? channelLog.executor : null;

        // Değişiklikleri kontrol et
        const changes = {
            name: oldChannel.name !== newChannel.name,
            topic: oldChannel.topic !== newChannel.topic,
            position: oldChannel.position !== newChannel.position,
            nsfw: oldChannel.nsfw !== newChannel.nsfw,
            rateLimitPerUser: oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser
        };

        // Sadece değişiklik varsa logla
        if (Object.values(changes).some(change => change)) {
            await logChannelEvent({
                channelId: newChannel.id,
                channelName: newChannel.name,
                channelType: newChannel.type,
                action: 'update',
                moderatorId: moderator?.id || null,
                moderatorUsername: moderator?.username || null,
                oldName: changes.name ? oldChannel.name : null,
                newName: changes.name ? newChannel.name : null,
                oldTopic: changes.topic ? oldChannel.topic : null,
                newTopic: changes.topic ? newChannel.topic : null,
                oldPosition: changes.position ? oldChannel.position : null,
                newPosition: changes.position ? newChannel.position : null
            });
        }

    } catch (error) {
        console.error('ChannelUpdate event hatası:', error);
    }
});

client.on(Events.ChannelPinsUpdate, async (channel, date) => {
    try {
        // Pin güncellemelerini logla (opsiyonel)
        console.log(`\x1b[38;5;208m📌 [PX-API]\x1b[0m Pin güncellendi: ${channel.name} - ${date}`);
    } catch (error) {
        console.error('ChannelPinsUpdate event hatası:', error);
    }
});

// logChannelEvent fonksiyonunu export et
module.exports = { logChannelEvent };

// API endpoint - Kanal loglarını getir
router.get('/', async (req, res) => {
    try {
        const { action, channel_id, moderator_id, limit = 100 } = req.query;
        
        let sql = 'SELECT * FROM discord_channel_log WHERE 1=1';
        const params = [];

        if (action && ['create', 'delete', 'update', 'permission_update', 'overwrite_update'].includes(action)) {
            sql += ' AND action = ?';
            params.push(action);
        }

        if (channel_id) {
            sql += ' AND channel_id = ?';
            params.push(channel_id);
        }

        if (moderator_id) {
            sql += ' AND moderator_id = ?';
            params.push(moderator_id);
        }

        sql += ' ORDER BY event_time DESC LIMIT ?';
        params.push(parseInt(limit));

        const [rows] = await db.pool.query(sql, params);

        const logs = rows.map(row => ({
            id: row.id,
            channel: {
                id: row.channel_id,
                name: row.channel_name,
                type: row.channel_type
            },
            action: row.action,
            moderator: row.moderator_id ? {
                id: row.moderator_id,
                username: row.moderator_username
            } : null,
            changes: {
                oldName: row.old_name,
                newName: row.new_name
            },
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
        console.error('Kanal logları alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kanal logları alınırken hata oluştu'
        });
    }
});

// Manuel kanal log ekleme endpoint'i
router.post('/', async (req, res) => {
    try {
        const { channelId, channelName, channelType, action, moderatorId, moderatorUsername, oldName, newName, reason } = req.body;

        if (!channelId || !channelName || !action) {
            return res.status(400).json({
                success: false,
                error: 'Gerekli alanlar eksik'
            });
        }

        await logChannelEvent({
            channelId,
            channelName,
            channelType: channelType || 'text',
            action,
            moderatorId,
            moderatorUsername,
            oldName,
            newName,
            reason
        });

        res.json({
            success: true,
            message: 'Kanal logu başarıyla kaydedildi'
        });

    } catch (error) {
        console.error('Manuel kanal log eklenirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kanal logu eklenirken hata oluştu'
        });
    }
});

// Kanal log istatistikleri
router.get('/stats', async (req, res) => {
    try {
        const [totalLogs] = await db.pool.query('SELECT COUNT(*) as total FROM discord_channel_log');
        const [actionStats] = await db.pool.query('SELECT action, COUNT(*) as count FROM discord_channel_log GROUP BY action');
        const [recentLogs] = await db.pool.query('SELECT COUNT(*) as count FROM discord_channel_log WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');
        const [moderatorStats] = await db.pool.query('SELECT moderator_username, COUNT(*) as count FROM discord_channel_log WHERE moderator_username IS NOT NULL GROUP BY moderator_username ORDER BY count DESC LIMIT 10');
        const [channelTypeStats] = await db.pool.query('SELECT channel_type, COUNT(*) as count FROM discord_channel_log GROUP BY channel_type');

        res.json({
            success: true,
            stats: {
                total: totalLogs[0].total,
                last24h: recentLogs[0].count,
                byAction: actionStats,
                byModerator: moderatorStats,
                byChannelType: channelTypeStats
            }
        });

    } catch (error) {
        console.error('Kanal log istatistikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

module.exports = router;
