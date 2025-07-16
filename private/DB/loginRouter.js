const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkLogin } = require('./models/userModel');
const { pool } = require('./connect');
const Config = require('../../config.js');

// JWT secret key - gerçek uygulamada bu değer environment variable olarak saklanmalı
const JWT_SECRET = 'your-super-secret-key-here';

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username and password are required'
            });
        }

        const isValid = await checkLogin(username, password);
        
        if (isValid) {
            // JWT token oluştur
            const token = jwt.sign(
                { username: username },
                JWT_SECRET,
                { expiresIn: '7d' } // 30 gün geçerli
            );

            res.json({
                status: 'success',
                message: 'Login successful',
                token: token
            });
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login'
        });
    }
});

// Token doğrulama endpoint'i
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            status: 'success',
            message: 'Token is valid',
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
});

// Kullanıcının Discord rollerini SQL'den dönen endpoint
router.get('/discord-roles', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ roles: [] });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // decoded.username ile kullanıcıyı bul
        // discord_id ile eşleştirmek için ek bilgi gerekebilir, örneğin username ile eşleşiyorsa:
        const [rows] = await pool.query('SELECT roles FROM discord_users WHERE username = ?', [decoded.username]);
        if (rows.length === 0) return res.json({ roles: [] });
        let roles = [];
        try {
            roles = JSON.parse(rows[0].roles);
        } catch (e) {}
        res.json({ roles });
    } catch (err) {
        res.json({ roles: [] });
    }
});

// Kullanıcı bilgilerini dönen endpoint
router.get('/api/auth/me', async (req, res) => {
    // Örneğin session veya JWT ile kullanıcıyı buluyorsan:
    // Eğer session kullanıyorsan:
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    // SQL'den kullanıcıyı çek
    const [rows] = await pool.query('SELECT discord_id, username, avatar FROM discord_users WHERE discord_id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    res.json(rows[0]);
});

module.exports = router; 