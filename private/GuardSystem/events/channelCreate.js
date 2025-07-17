const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelCreate',
    once: false,
    /**
     * @param {import('discord.js').GuildChannel} channel
     */
    async execute(channel) {
        try {
            const guild = channel.guild;
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelCreate
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

            // Guard değilse kanalı sil
            await channel.delete('Guard listesinde olmayan biri tarafından oluşturuldu.');

            // Logu veritabanına kaydet
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'channelCreate',
                    'block',
                    executor.id,
                    executor.tag,
                    channel.id,
                    channel.name,
                    JSON.stringify({ guildId: guild.id, guildName: guild.name, channelType: channel.type })
                ]
            );

            // Logla
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Yetkisiz Kanal Oluşturma Engellendi')
                .setDescription(`Guard listesinde olmayan bir kullanıcı kanal oluşturdu ve kanal silindi.`)
                .addFields(
                    { name: 'Kullanıcı', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Kanal', value: `${channel.name} (${channel.id})`, inline: true },
                    { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [channelCreate] Yetkisiz kanal oluşturma engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [channelCreate] Hata:', error);
        }
    }
}; 