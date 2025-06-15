const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkLogin } = require('./models/userModel');

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

module.exports = router; 