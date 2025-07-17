const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roleCreate',
    once: false,
    /**
     * @param {import('discord.js').Role} role
     */
    async execute(role) {
        try {
            const guild = role.guild;
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleCreate
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

            // Guard değilse rolü sil
            await role.delete('Guard listesinde olmayan biri tarafından oluşturuldu.');

            // Logu veritabanına kaydet
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'roleCreate',
                    'block',
                    executor.id,
                    executor.tag,
                    role.id,
                    role.name,
                    JSON.stringify({ guildId: guild.id, guildName: guild.name })
                ]
            );

            // Logla
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Yetkisiz Rol Oluşturma Engellendi')
                .setDescription(`Guard listesinde olmayan bir kullanıcı rol oluşturdu ve rol silindi.`)
                .addFields(
                    { name: 'Kullanıcı', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Rol', value: `${role.name} (${role.id})`, inline: true },
                    { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [roleCreate] Yetkisiz rol oluşturma engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [roleCreate] Hata:', error);
        }
    }
}; 