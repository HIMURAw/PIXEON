const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const Config = require('../../config.json');
const { pool } = require('../DB/connect');

// NOT: config.json'a "clientSecret" eklemelisin!
// "clientSecret": "BURAYA_SECRET"

// Şifreleme anahtarı (config.json'a ekleyebilirsin)
const ENCRYPTION_KEY = Config.dev?.encryptionKey || 'perronunanasininaminiyalayanutkininsikininkiliamacrypticin';
const ALGORITHM = 'aes-256-cbc';

// Şifreleme fonksiyonu
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Çözme fonksiyonu
function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

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

        // 5. Cookie set et - sadece username'i sakla
        const username = user.username + '#' + user.discriminator;

        // Cookie'yi 30 gün boyunca sakla (base64 encode ile)
        res.cookie('auth_token', Buffer.from(username).toString('base64'), {
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
router.get('/api/user/:encodedUsername', async (req, res) => {
    try {
        // Base64 decode yap
        const encodedUsername = req.params.encodedUsername;
        let username;

        try {
            username = Buffer.from(encodedUsername, 'base64').toString('utf8');
            console.log('Decoded username:', username); // Debug için
        } catch (decodeError) {
            console.error('Decode error:', decodeError);
            return res.status(400).json({ error: 'Invalid token' });
        }

        // SQL'den kullanıcıyı çek
        const [rows] = await pool.query(
            'SELECT discord_id, username, avatar, email FROM discord_users WHERE username = ?',
            [username]
        );

        console.log('SQL query result:', rows); // Debug için

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('User fetch error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


router.get('/user/check', (req, res) => {
    console.log('=== /user/check endpoint called ===');
    console.log('Request cookies:', req.cookies);
    
    // Cookie'den username'i al
    const authToken = req.cookies.auth_token;
    console.log('Auth token from cookie:', authToken);
    
    if (!authToken) {
        console.log('No auth token found - returning 401');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Base64 decode yap
    let username;
    try {
        username = Buffer.from(authToken, 'base64').toString('utf8');
        console.log('Decoded username from cookie:', username);
    } catch (decodeError) {
        console.error('Decode error:', decodeError);
        return res.status(400).json({ error: 'Invalid token' });
    }

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
            if (results.length === 0) {
                console.log('User not found in database for username:', username);
                return res.status(404).json({ error: 'User not found' });
            }
            console.log('User found in database:', results[0]);
            res.json(results[0]);
        }
    );
});

module.exports = router;
