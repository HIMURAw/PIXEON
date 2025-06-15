const express = require('express');
const router = express.Router();
const { checkLogin } = require('./connect');

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
            res.json({
                status: 'success',
                message: 'Login successful'
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

module.exports = router; 