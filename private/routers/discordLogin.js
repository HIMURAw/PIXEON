const express = require('express');
const router = express.Router();
const axios = require('axios');
const Config = require('../../config.json');
const { pool } = require('../DB/connect');

// NOT: config.json'a "clientSecret" eklemelisin!
// "clientSecret": "BURAYA_SECRET"

// Discord OAuth Callback - Kullanıcı giriş yaptığında çalışır
router.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send('No code provided');

    try {
        // 1. Discord'dan access token al
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

        // 2. Discord'dan kullanıcı bilgilerini çek
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const user = userRes.data;

        // 3. Kullanıcının Discord sunucusundaki rollerini çek
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

        // 4. Kullanıcı bilgilerini SQL veritabanına kaydet
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

        // 5. Cookie set et - username ve avatar'ı sakla
        const username = user.username + '#' + user.discriminator;
        
        // Avatar URL'ini oluştur
        let avatarUrl = '';
        if (user.avatar) {
            avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        } else {
            avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
        }

        // Cookie'ye username ve avatar'ı JSON olarak sakla
        const userData = {
            username: username,
            avatar: avatarUrl
        };
        
        const encodedUserData = encodeURIComponent(JSON.stringify(userData));
        res.cookie('auth_token', encodedUserData, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
            httpOnly: false, // JavaScript'ten erişilebilir olsun
            secure: false, // HTTPS kullanıyorsan true yap
            sameSite: 'lax'
        });

        // Başarılı girişten sonra ana sayfaya yönlendir
        res.redirect('/');

    } catch (err) {
        console.error('Discord login error:', err);
        res.status(500).send('Discord login failed');
    }
});

// Username ile kullanıcı bilgilerini döndüren endpoint
router.get('/api/user/:username', async (req, res) => {
    try {
        // Direkt username'i kullan (base64 decode yok)
        const username = req.params.username;
        console.log('Username from params:', username);

        // SQL'den kullanıcıyı çek
        const [rows] = await pool.query(
            'SELECT discord_id, username, avatar, email FROM discord_users WHERE username = ?',
            [username]
        );

        console.log('SQL query result:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('User fetch error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Test kullanıcısını veritabanına ekle
router.get('/add-user', async (req, res) => {
    try {
        await pool.query(`
            INSERT INTO discord_users (discord_id, username, avatar, email, roles) 
            VALUES ('123456789', 'himura_1#0', null, 'test@test.com', '[]')
            ON DUPLICATE KEY UPDATE username=VALUES(username)
        `);
        res.json({ message: 'User added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/user/check', (req, res) => {
    console.log('=== /user/check endpoint called ===');
    console.log('Request cookies:', req.cookies);

    // Cookie'den username'i al
    const authToken = req.cookies.auth_token;
    console.log('Auth token from cookie:', authToken);
    
    if (!authToken) {
        console.log('No auth token found - returning 401');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // URL-decode yap ve direkt username'i kullan
    const username = decodeURIComponent(authToken);
    console.log('Username from cookie (decoded):', username);

    // SQL'den kullanıcıyı çek - tüm bilgileri al
    console.log('Executing SQL query for username:', username);
    pool.query(
        'SELECT discord_id, username, avatar, email FROM discord_users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('SQL query results:', results);
            console.log('Number of results:', results.length);
            if (results.length === 0) {
                console.log('User not found in database for username:', username);
                return res.status(404).json({ error: 'User not found' });
            }
            console.log('User found in database:', results[0]);
            console.log('Sending response:', results[0]);
            res.json(results[0]);
        }
    );
});

module.exports = router;
