const config = require('../../config.json');
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/api/config', (req, res) => {
    res.json({
        serverIP: config.fivem.serverIP,
        serverPort: config.fivem.serverPort
    });
});

module.exports = router;