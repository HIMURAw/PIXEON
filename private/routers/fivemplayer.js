const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// FiveM sunucusundan oyuncu listesini çek
router.get('/players', async (req, res) => {
    try {
        // FiveM sunucusundaki Lua HTTP handler'ın endpointi
        // Örneğin: http://localhost:30120/characters
        const response = await fetch('http://localhost:30120/characters');
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
