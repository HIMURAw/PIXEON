const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const superagent = require('superagent');

const ServerIP = config.fivemServerIP || 'localhost';
const ServerPort = config.fivemServerPort || '30120';


// FiveM sunucusundan players.json'u proxy'le
router.get('/players-online', async (req, res) => {
    try {
        const response = await superagent.get('http://213.142.159.118:30120/players.json');
        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('FiveM players.json alınırken hata:', error);
        res.status(500).json({ error: 'FiveM players.json alınırken hata oluştu' });
    }
});

module.exports = router;
