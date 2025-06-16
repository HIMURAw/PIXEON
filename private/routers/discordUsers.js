const express = require('express');
const router = express.Router();
const Config = require('../../config.json');
const client = require('../../server.js');
const { pool } = require('../DB/connect');

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

// Kullanıcı geçmişi için veritabanı şeması (örnek)
const userHistorySchema = {
    userId: String,
    username: String,
    action: String, // 'warn', 'kick', 'ban', 'unban'
    reason: String,
    timestamp: Date,
    moderatorId: String,
    moderatorUsername: String
};

// Kullanıcı geçmişini getir
router.get('/history', async (req, res) => {
    try {
        const { type, date } = req.query;
        let query = 'SELECT * FROM user_history';
        const params = [];

        // Tarihe göre filtrele
        if (date) {
            query += ' WHERE DATE(timestamp) = ?';
            params.push(date);
        }

        // İşlem tipine göre filtrele
        if (type && type !== 'all') {
            query += params.length ? ' AND' : ' WHERE';
            query += ' action = ?';
            params.push(type);
        }

        // Geçmişi tarihe göre sırala (en yeniden en eskiye)
        query += ' ORDER BY timestamp DESC';

        const [rows] = await pool.execute(query, params);
        res.json({ history: rows });
    } catch (error) {
        console.error('Kullanıcı geçmişi alınırken hata:', error);
        res.status(500).json({ error: 'Kullanıcı geçmişi alınırken bir hata oluştu' });
    }
});

// Uyarı ekle
router.post('/warn', async (req, res) => {
    try {
        const { userId, reason } = req.body;
        const guild = await client.guilds.fetch(Config.discord.guidid);
        const member = await guild.members.fetch(userId);
        const moderator = req.user;

        // MySQL'e kaydet
        await pool.execute(
            'INSERT INTO user_history (user_id, username, action, reason, moderator_id, moderator_username) VALUES (?, ?, ?, ?, ?, ?)',
            [member.id, member.user.username, 'warn', reason || 'Sebep belirtilmedi', moderator.id, moderator.username]
        );

        // Kullanıcıya DM gönder
        try {
            await member.send(`Sunucuda uyarıldınız.\nSebep: ${reason || 'Sebep belirtilmedi'}`);
        } catch (error) {
            console.log('DM gönderilemedi:', error);
        }

        res.json({ success: true, message: 'Kullanıcı uyarıldı' });
    } catch (error) {
        console.error('Uyarı verilirken hata:', error);
        res.status(500).json({ error: 'Uyarı verilirken bir hata oluştu' });
    }
});

// Kick işlemi
router.post('/kick', async (req, res) => {
    try {
        const { userId, reason } = req.body;
        const guild = await client.guilds.fetch(Config.discord.guidid);
        const member = await guild.members.fetch(userId);
        const moderator = req.user;

        // MySQL'e kaydet
        await pool.execute(
            'INSERT INTO user_history (user_id, username, action, reason, moderator_id, moderator_username) VALUES (?, ?, ?, ?, ?, ?)',
            [member.id, member.user.username, 'kick', reason || 'Sebep belirtilmedi', moderator.id, moderator.username]
        );

        // Kullanıcıyı kickle
        await member.kick(reason || 'Sebep belirtilmedi');

        res.json({ success: true, message: 'Kullanıcı sunucudan atıldı' });
    } catch (error) {
        console.error('Kick işlemi sırasında hata:', error);
        res.status(500).json({ error: 'Kick işlemi sırasında bir hata oluştu' });
    }
});

// Ban işlemi
router.post('/ban', async (req, res) => {
    try {
        const { userId, reason } = req.body;
        const guild = await client.guilds.fetch(Config.discord.guidid);
        const member = await guild.members.fetch(userId);
        const moderator = req.user;

        // MySQL'e kaydet
        await pool.execute(
            'INSERT INTO user_history (user_id, username, action, reason, moderator_id, moderator_username) VALUES (?, ?, ?, ?, ?, ?)',
            [member.id, member.user.username, 'ban', reason || 'Sebep belirtilmedi', moderator.id, moderator.username]
        );

        // Kullanıcıyı banla
        await member.ban({ reason: reason || 'Sebep belirtilmedi' });

        res.json({ success: true, message: 'Kullanıcı yasaklandı' });
    } catch (error) {
        console.error('Ban işlemi sırasında hata:', error);
        res.status(500).json({ error: 'Ban işlemi sırasında bir hata oluştu' });
    }
});

// Ban kaldırma
router.post('/unban', async (req, res) => {
    try {
        const { userId, reason } = req.body;
        const guild = await client.guilds.fetch(Config.discord.guidid);
        const moderator = req.user;

        // Banlı kullanıcıyı bul
        const bans = await guild.bans.fetch();
        const bannedUser = bans.find(ban => ban.user.id === userId);

        if (!bannedUser) {
            return res.status(404).json({ error: 'Kullanıcı banlı değil' });
        }

        // MySQL'e kaydet
        await pool.execute(
            'INSERT INTO user_history (user_id, username, action, reason, moderator_id, moderator_username) VALUES (?, ?, ?, ?, ?, ?)',
            [bannedUser.user.id, bannedUser.user.username, 'unban', reason || 'Sebep belirtilmedi', moderator.id, moderator.username]
        );

        // Banı kaldır
        await guild.members.unban(userId, reason || 'Sebep belirtilmedi');

        res.json({ success: true, message: 'Kullanıcının yasağı kaldırıldı' });
    } catch (error) {
        console.error('Ban kaldırma işlemi sırasında hata:', error);
        res.status(500).json({ error: 'Ban kaldırma işlemi sırasında bir hata oluştu' });
    }
});

module.exports = router;