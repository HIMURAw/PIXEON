const express = require('express');
const router = express.Router();
const Config = require('../../config.json');
const client = require('../../server.js');

// Sunucu genel bilgilerini getir
router.get('/serverInfo', async (req, res) => {
    try {

        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Tüm üyeleri yükle
        await guild.members.fetch();
        await guild.channels.fetch();
        await guild.roles.fetch();

        const serverInfo = {
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL({ dynamic: true }),
            banner: guild.bannerURL({ dynamic: true }),
            description: guild.description,
            owner: {
                id: guild.ownerId,
                username: guild.members.cache.get(guild.ownerId)?.user.username,
                discriminator: guild.members.cache.get(guild.ownerId)?.user.discriminator,
                avatar: guild.members.cache.get(guild.ownerId)?.user.displayAvatarURL({ dynamic: true })
            },
            memberCount: guild.memberCount,
            memberStats: {
                total: guild.memberCount,
                online: guild.members.cache.filter(member => member.presence?.status === 'online').size,
                offline: guild.members.cache.filter(member => !member.presence || member.presence.status === 'offline').size,
                bots: guild.members.cache.filter(member => member.user.bot).size,
                humans: guild.members.cache.filter(member => !member.user.bot).size
            },
            channelStats: {
                total: guild.channels.cache.size,
                text: guild.channels.cache.filter(channel => channel.type === 0).size,
                voice: guild.channels.cache.filter(channel => channel.type === 2).size,
                categories: guild.channels.cache.filter(channel => channel.type === 4).size
            },
            roleStats: {
                total: guild.roles.cache.size,
                managed: guild.roles.cache.filter(role => role.managed).size,
                unmanaged: guild.roles.cache.filter(role => !role.managed).size
            },
            boostLevel: guild.premiumTier,
            boostCount: guild.premiumSubscriptionCount,
            verificationLevel: guild.verificationLevel,
            createdAt: guild.createdAt,
            features: guild.features
        };

        res.status(200).json(serverInfo);
    } catch (error) {
        console.error('Error fetching server info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sunucu kanallarını getir
router.get('/channels', async (req, res) => {
    try {


        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Tüm kanalları yükle
        const channels = await guild.channels.fetch();

        const channelList = channels.map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
            parent: channel.parent ? {
                id: channel.parent.id,
                name: channel.parent.name
            } : null,
            topic: channel.topic,
            nsfw: channel.nsfw,
            bitrate: channel.bitrate,
            userLimit: channel.userLimit,
            rateLimitPerUser: channel.rateLimitPerUser,
            permissions: channel.permissionOverwrites.cache.map(perm => ({
                id: perm.id,
                type: perm.type,
                allow: perm.allow.toArray(),
                deny: perm.deny.toArray()
            }))
        }));

        // Kanalları tipe göre sırala
        const sortedChannels = channelList.sort((a, b) => {
            // Önce kategoriler
            if (a.type === 4 && b.type !== 4) return -1;
            if (a.type !== 4 && b.type === 4) return 1;

            // Sonra pozisyon
            return a.position - b.position;
        });

        res.status(200).json({
            total: channelList.length,
            channels: sortedChannels
        });
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sunucu rollerini getir
router.get('/roles', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        await guild.roles.fetch();

        const roles = guild.roles.cache.map(role => ({
            id: role.id,
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions.toArray(),
            mentionable: role.mentionable,
            managed: role.managed,
            icon: role.iconURL({ dynamic: true }),
            unicodeEmoji: role.unicodeEmoji,
            members: role.members.size
        }));

        res.status(200).json({
            total: roles.length,
            roles: roles.sort((a, b) => b.position - a.position)
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sunucu emojilerini getir
router.get('/emojis', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(Config.discord.guidid);
        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        await guild.emojis.fetch();

        const emojis = guild.emojis.cache.map(emoji => ({
            id: emoji.id,
            name: emoji.name,
            animated: emoji.animated,
            url: emoji.url,
            roles: emoji.roles.cache.map(role => ({
                id: role.id,
                name: role.name
            }))
        }));

        res.status(200).json({
            total: emojis.length,
            emojis: emojis
        });
    } catch (error) {
        console.error('Error fetching emojis:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
