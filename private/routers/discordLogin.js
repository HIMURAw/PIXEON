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
            client_secret: Config.discord.clientSecret, // config.json'a eklemelisin!
            grant_type: 'authorization_code',
            code,
            redirect_uri: Config.discord.redirectUri,
            scope: 'identify email'
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenRes.data.access_token;

        // 2. Kullanıcı bilgilerini çek
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const user = userRes.data;

        // 3. SQL'e kaydet
        const sql = `
            INSERT INTO discord_users (discord_id, username, avatar, email)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE username=VALUES(username), avatar=VALUES(avatar), email=VALUES(email)
        `;
        await pool.query(sql, [
            user.id,
            user.username + '#' + user.discriminator,
            user.avatar,
            user.email || null
        ]);

        // 4. İstediğin sayfaya yönlendir
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Discord login failed');
    }
});

module.exports = router;
