const express = require('express');
const router = express.Router();

router.post('/discordUsers', async (req, res) => {
    try {
        const { discordId, username, discriminator } = req.body;

        if (!discordId || !username || !discriminator) {
            return res.status(400).json({ error: 'Missing required fields' });
        }


        const newUser = {
            discordId,
            username,
            discriminator,
            createdAt: new Date(),
        };

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating Discord user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;