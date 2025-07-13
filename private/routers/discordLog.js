const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');
const Config = require('../../config.json');
const axios = require('axios');
const { Events, AuditLogEvent } = require('discord.js');
const client = require('../../server.js');

// Role log kaydetme fonksiyonu
async function logRoleEvent(roleData) {
    try {
        // SQL'e kaydet
        const [result] = await db.pool.query(
            'INSERT INTO discord_role_log (user_id, username, avatar_url, role_id, role_name, role_color, action, moderator_id, moderator_username, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                roleData.userId,
                roleData.username,
                roleData.avatarUrl,
                roleData.roleId,
                roleData.roleName,
                roleData.roleColor,
                roleData.action,
                roleData.moderatorId || null,
                roleData.moderatorUsername || null,
                roleData.reason || null
            ]
        );

        // Webhook'a embed gönder
        const embed = {
            title: roleData.action === 'add' ? '🟢 Rol Verildi' : roleData.action === 'remove' ? '🔴 Rol Alındı' : '🟡 Rol Güncellendi',
            description: `**Kullanıcı:** ${roleData.username} (${roleData.userId})\n**Rol:** ${roleData.roleName} (${roleData.roleId})`,
            color: roleData.action === 'add' ? 0x00FF00 : roleData.action === 'remove' ? 0xFF0000 : 0xFFFF00,
            thumbnail: {
                url: roleData.avatarUrl
            },
            fields: [],
            timestamp: new Date()
        };

        if (roleData.moderatorUsername) {
            embed.fields.push({
                name: 'Moderatör',
                value: `${roleData.moderatorUsername} (${roleData.moderatorId})`,
                inline: true
            });
        }

        if (roleData.reason) {
            embed.fields.push({
                name: 'Sebep',
                value: roleData.reason,
                inline: true
            });
        }

        const webhookData = {
            username: Config.discord.log.WebhookName,
            avatar_url: Config.discord.log.WebhookLogoURL,
            embeds: [embed]
        };

        await axios.post(Config.discord.log.RoleLogWebhookURL, webhookData);
        console.log(`Rol logu kaydedildi: ${roleData.action} - ${roleData.username} - ${roleData.roleName}`);

    } catch (error) {
        console.error('Rol logu kaydedilirken hata:', error);
    }
}

// Discord event listeners
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    try {
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

        // Audit log'ları al
        const auditLogs = await newMember.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberRoleUpdate,
            limit: 1
        });

        const roleLog = auditLogs.entries.first();
        const moderator = roleLog ? roleLog.executor : null;

        // Eklenen roller
        for (const [roleId, role] of addedRoles) {
            await logRoleEvent({
                userId: newMember.id,
                username: newMember.user.username,
                avatarUrl: newMember.user.displayAvatarURL({ dynamic: true }),
                roleId: role.id,
                roleName: role.name,
                roleColor: role.hexColor,
                action: 'add',
                moderatorId: moderator?.id || null,
                moderatorUsername: moderator?.username || null,
                reason: roleLog?.reason || null
            });
        }

        // Çıkarılan roller
        for (const [roleId, role] of removedRoles) {
            await logRoleEvent({
                userId: newMember.id,
                username: newMember.user.username,
                avatarUrl: newMember.user.displayAvatarURL({ dynamic: true }),
                roleId: role.id,
                roleName: role.name,
                roleColor: role.hexColor,
                action: 'remove',
                moderatorId: moderator?.id || null,
                moderatorUsername: moderator?.username || null,
                reason: roleLog?.reason || null
            });
        }

    } catch (error) {
        console.error('GuildMemberUpdate event hatası:', error);
    }
});

// API endpoint - Rol loglarını getir
router.get('/role', async (req, res) => {
    try {
        const { action, user_id, role_id, limit = 100 } = req.query;
        
        let sql = 'SELECT * FROM discord_role_log WHERE 1=1';
        const params = [];

        if (action && ['add', 'remove', 'update'].includes(action)) {
            sql += ' AND action = ?';
            params.push(action);
        }

        if (user_id) {
            sql += ' AND user_id = ?';
            params.push(user_id);
        }

        if (role_id) {
            sql += ' AND role_id = ?';
            params.push(role_id);
        }

        sql += ' ORDER BY event_time DESC LIMIT ?';
        params.push(parseInt(limit));

        const [rows] = await db.pool.query(sql, params);

        const logs = rows.map(row => ({
            id: row.id,
            user: {
                id: row.user_id,
                username: row.username,
                avatar_url: row.avatar_url
            },
            role: {
                id: row.role_id,
                name: row.role_name,
                color: row.role_color
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
        console.error('Rol logları alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Rol logları alınırken hata oluştu'
        });
    }
});

// Manuel rol log ekleme endpoint'i
router.post('/role', async (req, res) => {
    try {
        const { userId, username, avatarUrl, roleId, roleName, roleColor, action, moderatorId, moderatorUsername, reason } = req.body;

        if (!userId || !username || !roleId || !roleName || !action) {
            return res.status(400).json({
                success: false,
                error: 'Gerekli alanlar eksik'
            });
        }

        await logRoleEvent({
            userId,
            username,
            avatarUrl: avatarUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`,
            roleId,
            roleName,
            roleColor: roleColor || '#000000',
            action,
            moderatorId,
            moderatorUsername,
            reason
        });

        res.json({
            success: true,
            message: 'Rol logu başarıyla kaydedildi'
        });

    } catch (error) {
        console.error('Manuel rol log eklenirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Rol logu eklenirken hata oluştu'
        });
    }
});

// Rol log istatistikleri
router.get('/role/stats', async (req, res) => {
    try {
        const [totalLogs] = await db.pool.query('SELECT COUNT(*) as total FROM discord_role_log');
        const [actionStats] = await db.pool.query('SELECT action, COUNT(*) as count FROM discord_role_log GROUP BY action');
        const [recentLogs] = await db.pool.query('SELECT COUNT(*) as count FROM discord_role_log WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');

        res.json({
            success: true,
            stats: {
                total: totalLogs[0].total,
                last24h: recentLogs[0].count,
                byAction: actionStats
            }
        });

    } catch (error) {
        console.error('Rol log istatistikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

module.exports = router;