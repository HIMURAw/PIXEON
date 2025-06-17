const express = require('express');
const router = express.Router();
const Config = require('../../config.json');
const client = require('../../server.js');
const { pool } = require('../DB/connect');
const { addUserHistory, getUserHistory } = require('../DB/models/userModel');
const { AuditLogEvent } = require('discord.js');

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
client.on('guildMemberRemove', async (member) => {
    try {
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

client.on('guildBanAdd', async (ban) => {
    try {
        console.log('Ban event triggered:', ban.user.username);

        const auditLogs = await ban.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberBanAdd,
            limit: 1
        });

        const banLog = auditLogs.entries.first();
        if (banLog && banLog.target.id === ban.user.id) {
            console.log('Ban detected, adding to history');
            await addUserHistory({
                userId: ban.user.id,
                username: ban.user.username,
                action: 'ban',
                reason: banLog.reason || 'Sebep belirtilmedi',
                moderatorId: banLog.executor.id,
                moderatorUsername: banLog.executor.username
            });
        }
    } catch (error) {
        console.error('Error in guildBanAdd event:', error);
    }
});

client.on('guildBanRemove', async (ban) => {
    try {
        console.log('Unban event triggered:', ban.user.username);

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

module.exports = router;