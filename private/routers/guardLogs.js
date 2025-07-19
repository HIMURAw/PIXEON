const express = require('express');
const router = express.Router();
const { pool } = require('../DB/connect');

// Guard Actions Log - discord_guard_action_log
router.get('/guard-actions-log', async (req, res) => {
    try {
        const [results] = await pool.query(
            `SELECT id, event_type, action, user_id, username, target_id, target_name, details, created_at FROM discord_guard_action_log ORDER BY created_at DESC LIMIT 100`
        );
        res.json(results);
    } catch (err) {
        console.error('[PX-API] Guard Actions Log sorgu hatası:', err);
        res.status(500).json({ error: 'Veri alınamadı.' });
    }
});

// Guard User Log - discord_guard_logs
router.get('/guard-user-log', async (req, res) => {
    try {
        const [results] = await pool.query(
            `SELECT id, user_id, username, action, old_level, new_level, permissions_changed, moderator_id, moderator_username, reason, created_at FROM discord_guard_logs ORDER BY created_at DESC LIMIT 100`
        );
        res.json(results);
    } catch (err) {
        console.error('[PX-API] Guard User Log sorgu hatası:', err);
        res.status(500).json({ error: 'Veri alınamadı.' });
    }
});

module.exports = router; 