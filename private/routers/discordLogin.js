const express = require('express');
const router = express.Router();
const axios = require('axios');
const Config = require('../../config.json');
const { pool } = require('../DB/connect');

// NOT: config.json'a "clientSecret" eklemelisin!
// "clientSecret": "BURAYA_SECRET"

router.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send('No code provided');

    try {
        // 1. Access token al
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: Config.discord.clientId,
            client_secret: Config.discord.clientSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: Config.discord.redirectUri,
            scope: 'identify email guilds guilds.members.read'
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenRes.data.access_token;

        // 2. Kullanıcı bilgilerini çek
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const user = userRes.data;

        // 3. Kullanıcının sunucu içindeki rollerini çek
        let roles = [];
        try {
            const memberRes = await axios.get(
                `https://discord.com/api/users/@me/guilds/${Config.discord.guidid}/member`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (memberRes.data && Array.isArray(memberRes.data.roles)) {
                roles = memberRes.data.roles;
            } else if (memberRes.data && memberRes.data.roles) {
                roles = Array.isArray(memberRes.data.roles) ? memberRes.data.roles : [memberRes.data.roles];
            } else {
                roles = [];
            }
        } catch (err) {
            console.warn('Kullanıcı sunucuda değil veya rolleri alınamadı:', err.response?.data || err.message);
            roles = [];
        }

        // 4. SQL'e kaydet (rolleri JSON olarak kaydediyoruz)
        const sql = `
            INSERT INTO discord_users (discord_id, username, avatar, email, roles)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE username=VALUES(username), avatar=VALUES(avatar), email=VALUES(email), roles=VALUES(roles)
        `;
        await pool.query(sql, [
            user.id,
            user.username + '#' + user.discriminator,
            user.avatar,
            user.email || null,
            JSON.stringify(roles)
        ]);

        // 5. Cookie set et - sadece username'i sakla
        const username = user.username + '#' + user.discriminator;
        
        // Cookie'yi 30 gün boyunca sakla
        res.cookie('auth_token', username, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
            httpOnly: false, // JavaScript'ten erişilebilir olsun
            secure: false, // HTTPS kullanıyorsan true yap
            sameSite: 'lax'
        });

        // Başarılı girişten sonra ana sayfaya yönlendir
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send('Discord login failed');
    }
});

// Username ile kullanıcı bilgilerini döndüren endpoint
router.get('/api/user/:username', async (req, res) => {
    try {
        const username = req.params.username;
        
        // SQL'den kullanıcıyı çek
        const [rows] = await pool.query(
            'SELECT discord_id, username, avatar, email FROM discord_users WHERE username = ?',
            [username]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('User fetch error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
