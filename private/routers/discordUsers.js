const express = require('express');
const router = express.Router();
const Config = require('../../config.json');
const client = require('../../server.js')


router.get('/serverMembers', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        const memberCount = guild.memberCount;

        res.status(200).json({
            serverName: guild.name,
            memberCount: memberCount,
            onlineMembers: guild.members.cache.filter(member => member.presence?.status === 'online').size,
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error('Error fetching server members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;