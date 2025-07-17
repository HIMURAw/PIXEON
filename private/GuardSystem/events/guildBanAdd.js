const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildBanAdd',
    once: false,
    /**
     * @param {import('discord.js').GuildBan} ban
     */
    async execute(ban) {
        try {
            const guild = ban.guild;
            const user = ban.user;
            // Son banlayan kişiyi audit logdan bul
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd
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

            // Guard değilse banı kaldır
            await guild.members.unban(user.id, 'Guard olmayan biri tarafından banlandığı için geri alındı.');

            // SQL log kaydı
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'guildBanAdd',
                    'block',
                    executor.id,
                    executor.tag,
                    user.id,
                    user.tag,
                    JSON.stringify({ guildId: guild.id, guildName: guild.name })
                ]
            );

            // Webhook logla
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🚫 İzinsiz Ban Engellendi')
                .setDescription(`Guard listesinde olmayan bir kullanıcı bir üyeyi banladı, ban geri alındı!`)
                .addFields(
                    { name: 'Banlayan', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Yasaklanan', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [guildBanAdd] İzinsiz ban engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [guildBanAdd] Hata:', error);
        }
    }
}; 