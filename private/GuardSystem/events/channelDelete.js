const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    once: false,
    /**
     * @param {import('discord.js').GuildChannel} channel
     */
    async execute(channel) {
        try {
            const guild = channel.guild;
            // Son silen kişiyi audit logdan bul
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelDelete
            });
            const auditEntry = fetchedLogs.entries.first();
            if (!auditEntry) return;
            const executor = auditEntry.executor;
            if (!executor || executor.bot) return;

            // Guard listesinde mi kontrol et
            const [userGuard] = await pool.query(
                'SELECT guard_level FROM discord_guard_users WHERE user_id = ? AND status = "active"',
                [executor.id]
            );
            if (userGuard.length > 0) return; // Guard ise izin ver

            // Kanalı geri oluştur (temel özelliklerle)
            let newChannel;
            if (channel.type === ChannelType.GuildText) {
                newChannel = await guild.channels.create({
                    name: channel.name,
                    type: ChannelType.GuildText,
                    parent: channel.parentId,
                    position: channel.position,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    permissionOverwrites: channel.permissionOverwrites.cache.map(o => o.toJSON())
                });
            } else if (channel.type === ChannelType.GuildVoice) {
                newChannel = await guild.channels.create({
                    name: channel.name,
                    type: ChannelType.GuildVoice,
                    parent: channel.parentId,
                    position: channel.position,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    permissionOverwrites: channel.permissionOverwrites.cache.map(o => o.toJSON())
                });
            } else {
                // Diğer kanal türleri için temel geri oluşturma
                newChannel = await guild.channels.create({
                    name: channel.name,
                    type: channel.type,
                    parent: channel.parentId,
                    position: channel.position
                });
            }

            // SQL log kaydı
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'channelDelete',
                    'block',
                    executor.id,
                    executor.tag,
                    channel.id,
                    channel.name,
                    JSON.stringify({ guildId: guild.id, guildName: guild.name })
                ]
            );

            // Logla
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🚨 İzinsiz Kanal Silme Engellendi')
                .setDescription(`Guard listesinde olmayan bir kullanıcı bir kanalı sildi, kanal geri oluşturuldu!`)
                .addFields(
                    { name: 'Silen', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Kanal', value: `${channel.name} (${channel.id})`, inline: true },
                    { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [channelDelete] İzinsiz kanal silme engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [channelDelete] Hata:', error);
        }
    }
}; 