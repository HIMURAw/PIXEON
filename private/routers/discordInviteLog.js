const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');
const Config = require('../../config.js');
const axios = require('axios');
const { Events, AuditLogEvent } = require('discord.js');
const client = require('../../server.js');

// Invite log kaydetme fonksiyonu
async function logInviteEvent(inviteData) {
    try {
        // SQL'e kaydet
        const [result] = await db.pool.query(
            'INSERT INTO discord_invite_log (invite_code, channel_id, channel_name, creator_id, creator_username, action, max_uses, max_age, uses_count, event_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                inviteData.inviteCode,
                inviteData.channelId,
                inviteData.channelName,
                inviteData.userId,
                inviteData.username,
                inviteData.action,
                inviteData.maxUses || null,
                inviteData.expiresAt ? Math.floor((inviteData.expiresAt - Date.now()) / 1000) : null,
                inviteData.uses || 0
            ]
        );

        // Webhook'a embed gönder
        const embed = {
            title: inviteData.action === 'create' ? '🟢 Davet Oluşturuldu' : inviteData.action === 'delete' ? '🔴 Davet Silindi' : '🟡 Davet Kullanıldı',
            description: `**Davet Kodu:** ${inviteData.inviteCode}\n**Kanal:** ${inviteData.channelName}\n**Kullanıcı:** ${inviteData.username} (${inviteData.userId})`,
            color: inviteData.action === 'create' ? 0x00FF00 : inviteData.action === 'delete' ? 0xFF0000 : 0xFFFF00,
            fields: [],
            timestamp: new Date()
        };

        if (inviteData.uses !== undefined) {
            embed.fields.push({
                name: 'Kullanım',
                value: `${inviteData.uses}${inviteData.maxUses ? `/${inviteData.maxUses}` : ''}`,
                inline: true
            });
        }

        if (inviteData.expiresAt) {
            embed.fields.push({
                name: 'Bitiş Tarihi',
                value: new Date(inviteData.expiresAt).toLocaleString('tr-TR'),
                inline: true
            });
        }

        if (inviteData.moderatorUsername) {
            embed.fields.push({
                name: 'Moderatör',
                value: `${inviteData.moderatorUsername} (${inviteData.moderatorId})`,
                inline: true
            });
        }

        if (inviteData.reason) {
            embed.fields.push({
                name: 'Sebep',
                value: inviteData.reason,
                inline: true
            });
        }

        const webhookData = {
            username: Config.discord.log.WebhookName,
            avatar_url: Config.discord.log.WebhookLogoURL,
            embeds: [embed]
        };

        await axios.post(Config.discord.log.inviteWebhookURL, webhookData);
        console.log(`\x1b[38;5;208m🔗 [PX-API]\x1b[0m Invite logu kaydedildi: ${inviteData.action} - ${inviteData.inviteCode} - ${inviteData.username}`);

    } catch (error) {
        console.error('Invite logu kaydedilirken hata:', error);
    }
}

// Discord event listeners
client.on(Events.InviteCreate, async (invite) => {
    try {
        console.log('\x1b[38;5;208m🎟️ [PX-API]\x1b[0m Davet oluşturuldu:', invite.code);

        // Audit log'ları al
        const auditLogs = await invite.guild.fetchAuditLogs({
            type: AuditLogEvent.InviteCreate,
            limit: 1
        });

        const inviteLog = auditLogs.entries.first();
        const moderator = inviteLog ? inviteLog.executor : null;

        await logInviteEvent({
            userId: invite.inviter?.id || moderator?.id || 'Unknown',
            username: invite.inviter?.username || moderator?.username || 'Unknown',
            avatarUrl: invite.inviter?.displayAvatarURL({ dynamic: true }) || moderator?.displayAvatarURL({ dynamic: true }) || `https://cdn.discordapp.com/embed/avatars/0.png`,
            inviteCode: invite.code,
            channelId: invite.channel.id,
            channelName: invite.channel.name,
            action: 'create',
            uses: invite.uses,
            maxUses: invite.maxUses,
            expiresAt: invite.expiresAt,
            moderatorId: moderator?.id || null,
            moderatorUsername: moderator?.username || null,
            reason: inviteLog?.reason || null
        });

    } catch (error) {
        console.error('\x1b[41m[PX-API] HATA\x1b[0m', error);
    }
});

client.on(Events.InviteDelete, async (invite) => {
    try {
        console.log('Davet silindi:', invite.code);

        // Audit log'ları al
        const auditLogs = await invite.guild.fetchAuditLogs({
            type: AuditLogEvent.InviteDelete,
            limit: 1
        });

        const inviteLog = auditLogs.entries.first();
        const moderator = inviteLog ? inviteLog.executor : null;

        await logInviteEvent({
            userId: moderator?.id || 'Unknown',
            username: moderator?.username || 'Unknown',
            avatarUrl: moderator?.displayAvatarURL({ dynamic: true }) || `https://cdn.discordapp.com/embed/avatars/0.png`,
            inviteCode: invite.code,
            channelId: invite.channel?.id || 'Unknown',
            channelName: invite.channel?.name || 'Unknown',
            action: 'delete',
            uses: invite.uses,
            maxUses: invite.maxUses,
            expiresAt: invite.expiresAt,
            moderatorId: moderator?.id || null,
            moderatorUsername: moderator?.username || null,
            reason: inviteLog?.reason || null
        });

    } catch (error) {
        console.error('InviteDelete event hatası:', error);
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
    try {
        // Yeni üye katıldığında, hangi davetle geldiğini bulmaya çalış
        const invites = await member.guild.invites.fetch();
        
        // Bu kısım karmaşık olabilir çünkü Discord API'si hangi davetle geldiğini doğrudan vermez
        // Bu yüzden sadece üye katılımını loglayalım
        console.log('\x1b[38;5;208m🆕 [PX-API]\x1b[0m Yeni üye katıldı:', member.user.username);

        await logInviteEvent({
            userId: member.user.id,
            username: member.user.username,
            avatarUrl: member.user.displayAvatarURL({ dynamic: true }),
            inviteCode: 'Unknown',
            channelId: 'Unknown',
            channelName: 'Unknown',
            action: 'use',
            uses: 0,
            maxUses: null,
            expiresAt: null,
            moderatorId: null,
            moderatorUsername: null,
            reason: 'Yeni üye katıldı'
        });

    } catch (error) {
        console.error('\x1b[41m[PX-API] HATA\x1b[0m', error);
    }
});

// API endpoint - Invite loglarını getir
router.get('/', async (req, res) => {
    try {
        const { action, user_id, invite_code, channel_id, limit = 100 } = req.query;
        
        let sql = 'SELECT * FROM discord_invite_log WHERE 1=1';
        const params = [];

        if (action && ['create', 'delete', 'use'].includes(action)) {
            sql += ' AND action = ?';
            params.push(action);
        }

        if (user_id) {
            sql += ' AND user_id = ?';
            params.push(user_id);
        }

        if (invite_code) {
            sql += ' AND invite_code = ?';
            params.push(invite_code);
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
            invite: {
                code: row.invite_code,
                channel_id: row.channel_id,
                channel_name: row.channel_name,
                uses: row.uses_count,
                max_uses: row.max_uses,
                expires_at: row.max_age ? new Date(Date.now() + row.max_age * 1000) : null
            },
            user: {
                id: row.creator_id,
                username: row.creator_username,
                avatar_url: `https://cdn.discordapp.com/embed/avatars/${parseInt(row.creator_id) % 5}.png`
            },
            action: row.action,
            moderator: null,
            reason: null,
            event_time: row.event_time,
            formatted_date: new Date(row.event_time).toLocaleString('tr-TR')
        }));

        res.json({
            success: true,
            logs: logs,
            total: logs.length
        });

    } catch (error) {
        console.error('Invite logları alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Invite logları alınırken hata oluştu'
        });
    }
});

// Manuel invite log ekleme endpoint'i
router.post('/', async (req, res) => {
    try {
        const { userId, username, avatarUrl, inviteCode, channelId, channelName, action, uses, maxUses, expiresAt, moderatorId, moderatorUsername, reason } = req.body;

        if (!userId || !username || !inviteCode || !action) {
            return res.status(400).json({
                success: false,
                error: 'Gerekli alanlar eksik'
            });
        }

        await logInviteEvent({
            userId,
            username,
            avatarUrl: avatarUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`,
            inviteCode,
            channelId: channelId || 'Unknown',
            channelName: channelName || 'Unknown',
            action,
            uses: uses || 0,
            maxUses: maxUses || null,
            expiresAt: expiresAt || null,
            moderatorId,
            moderatorUsername,
            reason
        });

        res.json({
            success: true,
            message: 'Invite logu başarıyla kaydedildi'
        });

    } catch (error) {
        console.error('Manuel invite log eklenirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Invite logu eklenirken hata oluştu'
        });
    }
});

// Invite log istatistikleri
router.get('/stats', async (req, res) => {
    try {
        const [totalLogs] = await db.pool.query('SELECT COUNT(*) as total FROM discord_invite_log');
        const [actionStats] = await db.pool.query('SELECT action, COUNT(*) as count FROM discord_invite_log GROUP BY action');
        const [recentLogs] = await db.pool.query('SELECT COUNT(*) as count FROM discord_invite_log WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');
        const [topChannels] = await db.pool.query('SELECT channel_name, COUNT(*) as count FROM discord_invite_log GROUP BY channel_name ORDER BY count DESC LIMIT 10');
        const [topInvites] = await db.pool.query('SELECT invite_code, COUNT(*) as count FROM discord_invite_log GROUP BY invite_code ORDER BY count DESC LIMIT 10');

        res.json({
            success: true,
            stats: {
                total: totalLogs[0].total,
                last24h: recentLogs[0].count,
                byAction: actionStats,
                topChannels: topChannels,
                topInvites: topInvites
            }
        });

    } catch (error) {
        console.error('Invite log istatistikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

module.exports = router; 