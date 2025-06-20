const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const superagent = require('superagent');

const ServerIP = config.fivem.serverIP || 'localhost';
const ServerPort = config.fivem.serverPort || '30120';


// FiveM sunucusundan characters.json'u proxy'le
router.get('/players-online', async (req, res) => {
    try {
        const response = await superagent.get(`http://${ServerIP}:${ServerPort}/px-web/characters`);
        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('FiveM characters.json alınırken hata:', error);
        res.status(500).json({ error: 'FiveM characters.json alınırken hata oluştu' });
    }
});

// FiveM sunucusundan characters verilerini al
router.get('/characters', async (req, res) => {
    try {
        const response = await superagent.get(`http://${ServerIP}:${ServerPort}/px-web/characters`);
        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('FiveM characters alınırken hata:', error);
        res.status(500).json({ error: 'FiveM characters alınırken hata oluştu', details: error.message });
    }
});

router.get('/characters-map', async (req, res) => {
    try {
        const response = await superagent.get(`http://${ServerIP}:${ServerPort}/px-web/characters`);
        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('FiveM characters alınırken hata:', error);
        res.status(500).json({ error: 'FiveM characters alınırken hata oluştu', details: error.message });
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

// FiveM sunucusundan server bilgilerini al
router.get('/info', async (req, res) => {
    try {
        const response = await superagent.get(`http://${ServerIP}:${ServerPort}/info.json`);
        res.json(JSON.parse(response.text));
    } catch (error) {
        console.error('FiveM info alınırken hata:', error);
        res.status(500).json({ error: 'FiveM info alınırken hata oluştu', details: error.message });
    }
});

module.exports = router;
