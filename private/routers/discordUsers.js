const express = require('express');
const router = express.Router();
const Config = require('../../config.json');
const client = require('../../server.js');

router.get('/serverMembers', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Tüm üyeleri yükle ve presence bilgilerini güncelle
        await guild.members.fetch({ withPresences: true });

        const memberCount = guild.memberCount;
        const members = guild.members.cache.map(member => ({
            username: member.user.username,
            discriminator: member.user.discriminator,
            id: member.id,
            status: member.presence?.status || 'offline',
            activities: member.presence?.activities?.map(activity => ({
                name: activity.name,
                type: activity.type,
                details: activity.details
            })) || [],
            avatar: member.user.displayAvatarURL({ dynamic: true }),
            joinedAt: member.joinedAt,
            roles: member.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.color,
                position: role.position
            })).sort((a, b) => b.position - a.position),
            isBot: member.user.bot,
            nickname: member.nickname
        }));

        // Online üye sayısını hesapla (online, idle ve dnd durumlarını dahil et)
        const onlineMembers = guild.members.cache.filter(member => 
            member.presence && 
            ['online', 'idle', 'dnd'].includes(member.presence.status)
        ).size;

        res.status(200).json({
            serverName: guild.name,
            memberCount: memberCount,
            onlineMembers: onlineMembers,
            members: members,
            lastUpdated: new Date()
        });
    } catch (error) {
        console.error('Error fetching server members:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;