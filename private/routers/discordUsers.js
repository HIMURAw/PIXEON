const express = require('express');
const router = express.Router();
const Config = require('../../config.js');
const client = require('../../server.js');
const db = require('../DB/connect.js');
const { addUserHistory, getUserHistory } = require('../DB/models/userModel');
const { AuditLogEvent, Events } = require('discord.js');
const axios = require('axios');

router.get('/serverMembers', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Tüm üyeleri yükle ve presence bilgilerini güncelle
        await guild.members.fetch({ withPresences: true });

        const memberCount = guild.memberCount;
        const members = guild.members.cache.map(member => ({
            username: member.user.username,
            discriminator: member.user.discriminator,
            id: member.id,
            status: member.presence?.status || 'offline',
            activities: member.presence?.activities?.map(activity => ({
                name: activity.name,
                type: activity.type,
                details: activity.details
            })) || [],
            avatar: member.user.displayAvatarURL({ dynamic: true }),
            joinedAt: member.joinedAt,
            roles: member.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.color,
                position: role.position
            })).sort((a, b) => b.position - a.position),
            isBot: member.user.bot,
            nickname: member.nickname
        }));

        // Online üye sayısını hesapla (online, idle ve dnd durumlarını dahil et)
        const onlineMembers = guild.members.cache.filter(member =>
            member.presence &&
            ['online', 'idle', 'dnd'].includes(member.presence.status)
        ).size;

        res.status(200).json({
            serverName: guild.name,
            memberCount: memberCount,
            onlineMembers: onlineMembers,
            members: members,
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error('Error fetching server members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Banlı kullanıcıları getir
router.get('/bannedUsers', async (req, res) => {
    try {


        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Sunucu bulunamadı' });
        }

        // Banlı kullanıcıları getir
        const bans = await guild.bans.fetch();

        // Banlı kullanıcıları formatla
        const bannedUsers = bans.map(ban => ({
            user: {
                id: ban.user.id,
                username: ban.user.username,
                discriminator: ban.user.discriminator,
                avatar: ban.user.displayAvatarURL({ dynamic: true }),
                bot: ban.user.bot
            },
            reason: ban.reason || 'Sebep belirtilmemiş',
            bannedAt: ban.createdAt,
            bannedBy: ban.executor ? {
                id: ban.executor.id,
                username: ban.executor.username,
                avatar: ban.executor.displayAvatarURL({ dynamic: true })
            } : null
        }));

        res.status(200).json({
            serverName: guild.name,
            banCount: bannedUsers.length,
            bannedUsers: bannedUsers,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Banlı kullanıcılar alınırken hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
    }
});

// Banlı kullanıcı ara
router.get('/searchBanned', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Arama sorgusu gerekli' });
        }

        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Sunucu bulunamadı' });
        }

        // Banlı kullanıcıları getir
        const bans = await guild.bans.fetch();

        // Arama yap
        const searchResults = bans.filter(ban => {
            const searchTerm = query.toLowerCase();
            return (
                ban.user.username.toLowerCase().includes(searchTerm) ||
                ban.user.id.includes(searchTerm) ||
                (ban.reason && ban.reason.toLowerCase().includes(searchTerm))
            );
        }).map(ban => ({
            user: {
                id: ban.user.id,
                username: ban.user.username,
                discriminator: ban.user.discriminator,
                avatar: ban.user.displayAvatarURL({ dynamic: true }),
                bot: ban.user.bot
            },
            reason: ban.reason || 'Sebep belirtilmemiş',
            bannedAt: ban.createdAt,
            bannedBy: ban.executor ? {
                id: ban.executor.id,
                username: ban.executor.username,
                avatar: ban.executor.displayAvatarURL({ dynamic: true })
            } : null
        }));

        res.status(200).json({
            query: query,
            resultCount: searchResults.length,
            results: searchResults,
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Banlı kullanıcı araması sırasında hata oluştu:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kullanıcı geçmişini getir
router.get('/history', async (req, res) => {
    try {
        const { type, date } = req.query;
        const history = await getUserHistory({ type, date });
        res.json({ history });
    } catch (error) {
        console.error('Kullanıcı geçmişi alınırken hata:', error);
        res.status(500).json({ error: 'Kullanıcı geçmişi alınırken bir hata oluştu' });
    }
});

// Uyarı ekle
router.post('/warn', async (req, res) => {
    try {
        console.log('Uyarı isteği alındı:', req.body);
        const { userId, reason } = req.body;

        console.log('Guild ID:', Config.discord.guidid);
        const guild = await client.guilds.fetch(Config.discord.guidid);
        console.log('Guild bulundu:', guild.name);

        const member = await guild.members.fetch(userId);
        console.log('Kullanıcı bulundu:', member.user.username);

        const moderator = req.user;
        console.log('Moderatör:', moderator.username);

        // MySQL'e kaydet
        try {
            await addUserHistory({
                userId: member.id,
                username: member.user.username,
                action: 'warn',
                reason: reason || 'Sebep belirtilmedi',
                moderatorId: moderator.id,
                moderatorUsername: moderator.username
            });
            console.log('MySQL kayıt başarılı');
        } catch (dbError) {
            console.error('MySQL kayıt hatası:', dbError);
            throw dbError;
        }

        // Kullanıcıya DM gönder
        try {
            await member.send(`Sunucuda uyarıldınız.\nSebep: ${reason || 'Sebep belirtilmedi'}`);
        } catch (error) {
            console.log('DM gönderilemedi:', error);
        }

        res.json({ success: true, message: 'Kullanıcı uyarıldı' });
    } catch (error) {
        console.error('Uyarı verilirken hata:', error);
        res.status(500).json({ error: 'Uyarı verilirken bir hata oluştu: ' + error.message });
    }
});

// Kick kullanıcı
router.post('/kick', async (req, res) => {
    try {
        console.log('Kick request received:', req.body);
        const { userId, reason, guildId } = req.body;
        const moderatorId = req.user.id;
        const moderatorUsername = req.user.username;

        console.log('Fetching guild...');
        const guild = await client.guilds.fetch(guildId);
        console.log('Guild fetched:', guild.name);

        console.log('Fetching member...');
        const member = await guild.members.fetch(userId);
        console.log('Member fetched:', member.user.username);

        console.log('Fetching moderator...');
        const moderator = await guild.members.fetch(moderatorId);
        console.log('Moderator fetched:', moderator.user.username);

        console.log('Attempting to kick member...');
        await member.kick(reason);
        console.log('Member kicked successfully');

        console.log('Adding to history...');
        await addUserHistory({
            userId,
            username: member.user.username,
            action: 'kick',
            reason,
            moderatorId,
            moderatorUsername
        });
        console.log('History added successfully');

        // Kullanıcıya DM gönder
        try {
            console.log('Sending DM to user...');
            const dmChannel = await member.user.createDM();
            await dmChannel.send({
                embeds: [{
                    title: 'Sunucudan Atıldınız',
                    description: `**Sunucu:** ${guild.name}\n**Sebep:** ${reason || 'Sebep belirtilmedi'}\n**Moderatör:** ${moderatorUsername}`,
                    color: 0xFF0000,
                    timestamp: new Date()
                }]
            });
            console.log('DM sent successfully');
        } catch (dmError) {
            console.error('DM gönderilemedi:', dmError);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Kick error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        res.status(500).json({
            success: false,
            error: error.message,
            details: {
                code: error.code,
                name: error.name
            }
        });
    }
});

// Ban işlemi
router.post('/ban', async (req, res) => {
    try {
        console.log('Ban isteği alındı:', req.body);
        const { userId, reason } = req.body;

        console.log('Guild ID:', Config.discord.guidid);
        const guild = await client.guilds.fetch(Config.discord.guidid);
        console.log('Guild bulundu:', guild.name);

        const member = await guild.members.fetch(userId);
        console.log('Kullanıcı bulundu:', member.user.username);

        const moderator = req.user;
        console.log('Moderatör:', moderator.username);

        // MySQL'e kaydet
        try {
            await addUserHistory({
                userId: member.id,
                username: member.user.username,
                action: 'ban',
                reason: reason || 'Sebep belirtilmedi',
                moderatorId: moderator.id,
                moderatorUsername: moderator.username
            });
            console.log('MySQL kayıt başarılı');
        } catch (dbError) {
            console.error('MySQL kayıt hatası:', dbError);
            throw dbError;
        }

        // Kullanıcıyı banla
        await member.ban({ reason: reason || 'Sebep belirtilmedi' });
        console.log('Kullanıcı banlandı');

        res.json({ success: true, message: 'Kullanıcı yasaklandı' });
    } catch (error) {
        console.error('Ban işlemi sırasında hata:', error);
        res.status(500).json({ error: 'Ban işlemi sırasında bir hata oluştu: ' + error.message });
    }
});

// Ban kaldırma
router.post('/unban', async (req, res) => {
    try {
        console.log('Unban isteği alındı:', req.body);
        const { userId, reason } = req.body;

        console.log('Guild ID:', Config.discord.guidid);
        const guild = await client.guilds.fetch(Config.discord.guidid);
        console.log('Guild bulundu:', guild.name);

        const moderator = req.user;
        console.log('Moderatör:', moderator.username);

        // Banlı kullanıcıyı bul
        const bans = await guild.bans.fetch();
        const bannedUser = bans.find(ban => ban.user.id === userId);

        if (!bannedUser) {
            return res.status(404).json({ error: 'Kullanıcı banlı değil' });
        }

        // MySQL'e kaydet
        try {
            await addUserHistory({
                userId: bannedUser.user.id,
                username: bannedUser.user.username,
                action: 'unban',
                reason: reason || 'Sebep belirtilmedi',
                moderatorId: moderator.id,
                moderatorUsername: moderator.username
            });
            console.log('MySQL kayıt başarılı');
        } catch (dbError) {
            console.error('MySQL kayıt hatası:', dbError);
            throw dbError;
        }

        // Banı kaldır
        await guild.members.unban(userId, reason || 'Sebep belirtilmedi');
        console.log('Kullanıcının banı kaldırıldı');

        res.json({ success: true, message: 'Kullanıcının yasağı kaldırıldı' });
    } catch (error) {
        console.error('Ban kaldırma işlemi sırasında hata:', error);
        res.status(500).json({ error: 'Ban kaldırma işlemi sırasında bir hata oluştu: ' + error.message });
    }
});

// Discord event listeners
client.on('guildMemberAdd', async (member) => {
    try {
        // Yeni katılan kullanıcıya otomatik rol ver
        const defaultRoleId = Config.discord.defaultRoleId; // config.js'de tanımlı olmalı
        if (defaultRoleId) {
            await member.roles.add(defaultRoleId);
            console.log(`\x1b[32m[PX-API]\x1b[0m Yeni katılan kullanıcıya rol verildi: ${defaultRoleId}`);
        } else {
            console.warn('[PX-API] defaultRoleId config.js dosyasında tanımlı değil!');
        }
    } catch (roleError) {
        console.error('Yeni katılan kullanıcıya rol atanamadı:', roleError);
    }
    try {
        // Discord webhook logu
        const data = {
            username: 'Sunucu Log',
            embeds: [{
                title: 'Kullanıcı Katıldı',
                description: `**${member.user.tag}** (${member.id}) sunucuya katıldı.`,
                thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) },
                timestamp: new Date(),
                color: 0x00FF00
            }]
        };
        await axios.post(Config.discord.log.LoginLogoutWebhookURL, data);
    } catch (error) {
        console.error('Webhooka katılma logu gönderilemedi:', error);
    }
    // Veritabanına kaydet
    try {
        await db.pool.query(
            'INSERT INTO discord_member_log (user_id, username, avatar_url, action) VALUES (?, ?, ?, ?)',
            [member.id, member.user.username, member.user.displayAvatarURL({ dynamic: true }), 'join']
        );
    } catch (dbError) {
        console.error('Kullanıcı katılımı veritabanına kaydedilemedi:', dbError);
    }
});

client.on('guildMemberRemove', async (member) => {
    try {
        // Discord webhook logu
        try {
            const data = {
                username: 'Sunucu Log',
                embeds: [{
                    title: 'Kullanıcı Ayrıldı',
                    description: `**${member.user.tag}** (${member.id}) sunucudan ayrıldı.`,
                    thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) },
                    timestamp: new Date(),
                    color: 0xFF0000
                }]
            };
            await axios.post(Config.discord.log.LoginLogoutWebhookURL, data);
        } catch (webhookError) {
            console.error('Webhooka ayrılma logu gönderilemedi:', webhookError);
        }
        // Veritabanına kaydet
        try {
            await db.pool.query(
                'INSERT INTO discord_member_log (user_id, username, avatar_url, action) VALUES (?, ?, ?, ?)',
                [member.id, member.user.username, member.user.displayAvatarURL({ dynamic: true }), 'leave']
            );
        } catch (dbError) {
            console.error('Kullanıcı ayrılması veritabanına kaydedilemedi:', dbError);
        }

        console.log('Member removed event triggered:', member.user.username);

        // Check if the member was kicked
        const auditLogsKick = await member.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberKick,
            limit: 1
        });

        const auditLogsBan = await member.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanAdd,
            limit: 1
        });

        const kickLog = auditLogsKick.entries.first();
        if (kickLog && kickLog.target.id === member.id) {
            console.log('Kick detected, adding to history');
            await addUserHistory({
                userId: member.id,
                username: member.user.username,
                action: 'kick',
                reason: kickLog.reason || 'Sebep belirtilmedi',
                moderatorId: kickLog.executor.id,
                moderatorUsername: kickLog.executor.username
            });
        }

        const kickLogBan = auditLogsBan.entries.first();
        if (kickLogBan && kickLogBan.target.id === member.id) {
            console.log('Ban detected, adding to history');
            await addUserHistory({
                userId: member.id,
                username: member.user.username,
                action: 'ban',
                reason: kickLogBan.reason || 'Sebep belirtilmedi',
                moderatorId: kickLogBan.executor.id,
                moderatorUsername: kickLogBan.executor.username
            });
        }

    } catch (error) {
        console.error('Error in guildMemberRemove event:', error);
    }
});

client.on(Events.GuildBanRemove, async (ban) => {
    console.log('Guild ban remove event triggered:', ban.user.username);
    try {
        const auditLogs = await ban.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanRemove,
            limit: 1
        });

        const unbanLog = auditLogs.entries.first();
        if (unbanLog && unbanLog.target.id === ban.user.id) {
            console.log('Unban detected, adding to history');
            await addUserHistory({
                userId: ban.user.id,
                username: ban.user.username,
                action: 'unban',
                reason: unbanLog.reason || 'Sebep belirtilmedi',
                moderatorId: unbanLog.executor.id,
                moderatorUsername: unbanLog.executor.username
            });
        }
    } catch (error) {
        console.error('Error in guildBanRemove event:', error);
    }
});

const moment = require('moment');

router.get('/historyList', async (req, res) => {
    try {
        const { type, date } = req.query;
        let sql = 'SELECT * FROM user_history WHERE 1=1';
        const params = [];

        if (type && type !== 'all') {
            sql += ' AND action = ?';
            params.push(type);
        }
        if (date) {
            sql += ' AND DATE(timestamp) = ?';
            params.push(date);
        }

        sql += ' ORDER BY timestamp DESC';

        const [rows] = await db.pool.query(sql, params);

        // Düzenli ve sade veri
        const history = rows.map(row => ({
            id: row.id,
            user: {
                id: row.user_id,
                username: row.username
            },
            action: row.action,
            reason: row.reason,
            moderator: {
                id: row.moderator_id,
                username: row.moderator_username
            },
            timestamp: row.timestamp,
            formattedDate: row.timestamp
                ? new Date(row.timestamp).toLocaleString('tr-TR')
                : null
        }));

        res.json({ history });
    } catch (error) {
        console.error('Kullanıcı geçmişi alınırken hata:', error);
        res.status(500).json({ error: 'Kullanıcı geçmişi alınırken bir hata oluştu' });
    }
});

// Sunucu aktivite istatistikleri
router.get('/activity', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }
        await guild.members.fetch({ withPresences: true });
        await guild.channels.fetch();

        // Aktif kullanıcılar (online, idle, dnd)
        const activeUsers = guild.members.cache.filter(m => m.presence && ['online', 'idle', 'dnd'].includes(m.presence.status)).size;
        // Ses kanalında olan kullanıcılar
        const voiceChannelUsers = guild.channels.cache.filter(c => c.type === 2).reduce((acc, channel) => acc + channel.members.size, 0);
        // Toplam kullanıcı
        const totalUsers = guild.memberCount;
        // Ses kanalı kullanım yüzdesi
        const voiceChannelUsage = totalUsers > 0 ? Math.round((voiceChannelUsers / totalUsers) * 100) : 0;
        // Mesaj aktivitesi (örnek: son 24 saatteki mesaj sayısı, burada 0 dönecek, gerçek veri için log tutmanız gerekir)
        const messageActivity = 0;

        // Grafik için örnek veri
        const activityData = {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
            activeUsers: [10, 12, 15, 13, 17, 20, activeUsers],
            voiceChannelUsage: [5, 7, 8, 6, 9, 10, voiceChannelUsage],
            messageActivity: [100, 120, 140, 110, 160, 180, messageActivity]
        };

        res.json({
            activeUsers,
            voiceChannelUsage,
            messageActivity,
            activityData
        });
    } catch (error) {
        console.error('Error fetching server activity:', error);
        res.status(500).json({ error: 'Sunucu aktivitesi alınırken hata oluştu' });
    }
});

// Discord giriş/çıkış logunu listeleyen API
router.get('/memberLog', async (req, res) => {
    try {
        const { action } = req.query;
        let sql = 'SELECT user_id, username, avatar_url, action, event_time FROM discord_member_log';
        const params = [];
        if (action === 'join' || action === 'leave') {
            sql += ' WHERE action = ?';
            params.push(action);
        }
        sql += ' ORDER BY event_time DESC LIMIT 100';
        const [rows] = await db.pool.query(sql, params);
        res.json({ success: true, logs: rows });
    } catch (error) {
        console.error('Discord giriş/çıkış logu alınırken hata:', error);
        res.status(500).json({ success: false, error: 'Log alınırken hata oluştu' });
    }
});

router.get('/loginLog', async (req, res) => {
    try {
        const { action } = req.query;
        let sql = 'SELECT user_id, username, avatar_url, action, event_time FROM discord_member_log';
        const params = [];
        if (action === 'join' || action === 'leave') {
            sql += ' WHERE action = ?';
            params.push(action);
        }
        sql += ' ORDER BY event_time DESC LIMIT 100';
        const [rows] = await db.pool.query(sql, params);
        res.json({ success: true, logs: rows });
    } catch (error) {
        console.error('Discord giriş/çıkış logu alınırken hata:', error);
        res.status(500).json({ success: false, error: 'Log alınırken hata oluştu' });
    }
});


module.exports = router;