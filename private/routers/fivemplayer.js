const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const config = require('../../config.json');

const ServerIP = config.fivemServerIP || 'localhost';
const ServerPort = config.fivemServerPort || '30120';

router.get('/players', async (req, res) => {
    try {
        // FiveM sunucusundaki Lua HTTP handler'ın endpointi
        // Örneğin: http://localhost:30120/characters
        const response = await fetch('http://213.142.159.118:30120/px-web/characters');
        if (!response.ok) {
            return res.status(500).json({ error: 'FiveM sunucusundan veri alınamadı' });
        }
        const players = await response.json();
        res.json({
            count: players.length,
            players: players.map(p => ({
                id: p.id || p.identifier || '',
                name: p.name || p.playerName || '',
                ...p
            }))
        });
    } catch (error) {
        console.error('FiveM oyuncu listesi alınırken hata:', error);
        res.status(500).json({ error: 'FiveM oyuncu listesi alınırken hata oluştu' });
    }
});

module.exports = router;
