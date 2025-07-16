const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');
const Config = require('../../config.js');
const axios = require('axios');
const client = require('../../server.js');
const { Events } = require('discord.js');

// Voice log kaydetme fonksiyonu
async function logVoiceEvent(voiceData) {
    try {
        // SQL'e kaydet
        const [result] = await db.pool.query(
            'INSERT INTO discord_voice_log (user_id, username, avatar_url, channel_id, channel_name, action, duration_seconds, event_time) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [
                voiceData.userId,
                voiceData.username,
                voiceData.avatarUrl,
                voiceData.channelId,
                voiceData.channelName,
                voiceData.action,
                voiceData.duration || null
            ]
        );

        // Webhook'a embed gönder
        const actionEmojis = {
            'join': '🎧',
            'leave': '🔇',
            'move': '🔄',
            'mute': '🔇',
            'unmute': '🔊',
            'deafen': '🔇',
            'undeafen': '🔊'
        };

        const actionColors = {
            'join': 0x00FF00,
            'leave': 0xFF0000,
            'move': 0xFFFF00,
            'mute': 0xFF6600,
            'unmute': 0x00FF00,
            'deafen': 0xFF6600,
            'undeafen': 0x00FF00
        };

        const actionTexts = {
            'join': 'Ses Kanalına Katıldı',
            'leave': 'Ses Kanalından Ayrıldı',
            'move': 'Ses Kanalı Değiştirdi',
            'mute': 'Sesi Kapatıldı',
            'unmute': 'Sesi Açıldı',
            'deafen': 'Kulaklığı Kapatıldı',
            'undeafen': 'Kulaklığı Açıldı'
        };

        const embed = {
            title: `${actionEmojis[voiceData.action]} ${actionTexts[voiceData.action]}`,
            description: `**Kullanıcı:** ${voiceData.username} (${voiceData.userId})\n**Kanal:** ${voiceData.channelName} (${voiceData.channelId})`,
            color: actionColors[voiceData.action],
            thumbnail: {
                url: voiceData.avatarUrl
            },
            fields: [],
            timestamp: new Date()
        };

        if (voiceData.duration && voiceData.action === 'leave') {
            const hours = Math.floor(voiceData.duration / 3600);
            const minutes = Math.floor((voiceData.duration % 3600) / 60);
            const seconds = voiceData.duration % 60;
            
            let durationText = '';
            if (hours > 0) durationText += `${hours} saat `;
            if (minutes > 0) durationText += `${minutes} dakika `;
            if (seconds > 0) durationText += `${seconds} saniye`;
            
            embed.fields.push({
                name: 'Süre',
                value: durationText.trim(),
                inline: true
            });
        }

        if (voiceData.oldChannel && voiceData.action === 'move') {
            embed.fields.push({
                name: 'Önceki Kanal',
                value: voiceData.oldChannel,
                inline: true
            });
        }

        const webhookData = {
            username: Config.discord.log.WebhookName,
            avatar_url: Config.discord.log.WebhookLogoURL,
            embeds: [embed]
        };

        await axios.post(Config.discord.log.VoiceWebhookURL, webhookData);
        console.log(`Ses logu kaydedildi: ${voiceData.action} - ${voiceData.username} - ${voiceData.channelName}`);

    } catch (error) {
        console.error('Ses logu kaydedilirken hata:', error);
    }
}

// Kullanıcı ses durumlarını takip etmek için Map
const userVoiceStates = new Map();

// Discord voice event listeners
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    try {
        const user = newState.member?.user || oldState.member?.user;
        if (!user || user.bot) return;

        const userId = user.id;
        const username = user.username;
        const avatarUrl = user.displayAvatarURL({ dynamic: true });

        // Kullanıcının önceki ses durumunu al
        const previousState = userVoiceStates.get(userId);

        // Ses kanalına katılma
        if (!oldState.channelId && newState.channelId) {
            await logVoiceEvent({
                userId,
                username,
                avatarUrl,
                channelId: newState.channelId,
                channelName: newState.channel.name,
                action: 'join'
            });

            // Kullanıcının ses durumunu kaydet
            userVoiceStates.set(userId, {
                channelId: newState.channelId,
                channelName: newState.channel.name,
                joinTime: Date.now(),
                isMuted: newState.mute,
                isDeafened: newState.deaf
            });

        }
        // Ses kanalından ayrılma
        else if (oldState.channelId && !newState.channelId) {
            const userState = userVoiceStates.get(userId);
            let duration = null;

            if (userState && userState.joinTime) {
                duration = Math.floor((Date.now() - userState.joinTime) / 1000);
            }

            await logVoiceEvent({
                userId,
                username,
                avatarUrl,
                channelId: oldState.channelId,
                channelName: oldState.channel?.name || 'Bilinmeyen Kanal',
                action: 'leave',
                duration
            });

            // Kullanıcının ses durumunu temizle
            userVoiceStates.delete(userId);

        }
        // Ses kanalı değiştirme
        else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            await logVoiceEvent({
                userId,
                username,
                avatarUrl,
                channelId: newState.channelId,
                channelName: newState.channel.name,
                action: 'move',
                oldChannel: oldState.channel?.name || 'Bilinmeyen Kanal'
            });

            // Kullanıcının ses durumunu güncelle
            userVoiceStates.set(userId, {
                channelId: newState.channelId,
                channelName: newState.channel.name,
                joinTime: Date.now(),
                isMuted: newState.mute,
                isDeafened: newState.deaf
            });

        }
        // Ses kapatma/açma
        else if (oldState.channelId && newState.channelId && oldState.channelId === newState.channelId) {
            // Ses kapatma
            if (!oldState.mute && newState.mute) {
                await logVoiceEvent({
                    userId,
                    username,
                    avatarUrl,
                    channelId: newState.channelId,
                    channelName: newState.channel.name,
                    action: 'mute'
                });
            }
            // Ses açma
            else if (oldState.mute && !newState.mute) {
                await logVoiceEvent({
                    userId,
                    username,
                    avatarUrl,
                    channelId: newState.channelId,
                    channelName: newState.channel.name,
                    action: 'unmute'
                });
            }
            // Kulaklık kapatma
            else if (!oldState.deaf && newState.deaf) {
                await logVoiceEvent({
                    userId,
                    username,
                    avatarUrl,
                    channelId: newState.channelId,
                    channelName: newState.channel.name,
                    action: 'deafen'
                });
            }
            // Kulaklık açma
            else if (oldState.deaf && !newState.deaf) {
                await logVoiceEvent({
                    userId,
                    username,
                    avatarUrl,
                    channelId: newState.channelId,
                    channelName: newState.channel.name,
                    action: 'undeafen'
                });
            }

            // Kullanıcının ses durumunu güncelle
            const userState = userVoiceStates.get(userId);
            if (userState) {
                userState.isMuted = newState.mute;
                userState.isDeafened = newState.deaf;
                userVoiceStates.set(userId, userState);
            }
        }

    } catch (error) {
        console.error('VoiceStateUpdate event hatası:', error);
    }
});

// logVoiceEvent fonksiyonunu export et
module.exports = { logVoiceEvent };

// API endpoint - Ses loglarını getir
router.get('/', async (req, res) => {
    try {
        const { action, user_id, channel_id, limit = 100 } = req.query;
        
        let sql = 'SELECT * FROM discord_voice_log WHERE 1=1';
        const params = [];

        if (action && ['join', 'leave', 'move', 'mute', 'unmute', 'deafen', 'undeafen'].includes(action)) {
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
            user: {
                id: row.user_id,
                username: row.username,
                avatar_url: row.avatar_url
            },
            channel: {
                id: row.channel_id,
                name: row.channel_name
            },
            action: row.action,
            duration: row.duration_seconds,
            event_time: row.event_time,
            formatted_date: new Date(row.event_time).toLocaleString('tr-TR')
        }));

        res.json({
            success: true,
            logs: logs,
            total: logs.length
        });

    } catch (error) {
        console.error('Ses logları alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Ses logları alınırken hata oluştu'
        });
    }
});

// Manuel ses log ekleme endpoint'i
router.post('/', async (req, res) => {
    try {
        const { userId, username, avatarUrl, channelId, channelName, action, duration } = req.body;

        if (!userId || !username || !channelId || !channelName || !action) {
            return res.status(400).json({
                success: false,
                error: 'Gerekli alanlar eksik'
            });
        }

        await logVoiceEvent({
            userId,
            username,
            avatarUrl: avatarUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`,
            channelId,
            channelName,
            action,
            duration
        });

        res.json({
            success: true,
            message: 'Ses logu başarıyla kaydedildi'
        });

    } catch (error) {
        console.error('Manuel ses log eklenirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Ses logu eklenirken hata oluştu'
        });
    }
});

// Ses log istatistikleri
router.get('/stats', async (req, res) => {
    try {
        const [totalLogs] = await db.pool.query('SELECT COUNT(*) as total FROM discord_voice_log');
        const [actionStats] = await db.pool.query('SELECT action, COUNT(*) as count FROM discord_voice_log GROUP BY action');
        const [recentLogs] = await db.pool.query('SELECT COUNT(*) as count FROM discord_voice_log WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)');
        const [channelStats] = await db.pool.query('SELECT channel_name, COUNT(*) as count FROM discord_voice_log GROUP BY channel_name ORDER BY count DESC LIMIT 10');
        const [userStats] = await db.pool.query('SELECT username, COUNT(*) as count FROM discord_voice_log GROUP BY username ORDER BY count DESC LIMIT 10');

        res.json({
            success: true,
            stats: {
                total: totalLogs[0].total,
                last24h: recentLogs[0].count,
                byAction: actionStats,
                byChannel: channelStats,
                byUser: userStats
            }
        });

    } catch (error) {
        console.error('Ses log istatistikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

module.exports = router;
