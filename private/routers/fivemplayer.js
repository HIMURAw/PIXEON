const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const superagent = require('superagent');

const ServerIP = config.fivem.serverIP || 'localhost';
const ServerPort = config.fivem.serverPort || '30120';


// FiveM sunucusundan players.json'u proxy'le
router.get('/players-online', async (req, res) => {
    try {
        const response = await superagent.get(`http://${ServerIP}:${ServerPort}/players.json`);
        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('FiveM players.json alınırken hata:', error);
        res.status(500).json({ error: 'FiveM players.json alınırken hata oluştu' });
    }
});

// FiveM sunucusundan oyuncu pozisyonlarını al
router.get('/positions', async (req, res) => {
    try {
        const response = await superagent.get(`http://${ServerIP}:${ServerPort}/px-web/positions`);
        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('FiveM positions alınırken hata:', error);
        res.status(500).json({ error: 'FiveM positions alınırken hata oluştu', details: error.message });
    }
});

module.exports = router;
