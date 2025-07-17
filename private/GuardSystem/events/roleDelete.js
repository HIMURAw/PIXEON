const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'roleDelete',
    once: false,
    /**
     * @param {import('discord.js').Role} role
     */
    async execute(role) {
        try {
            const guild = role.guild;
            // Son silen kişiyi audit logdan bul
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleDelete
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

            // Rolü geri oluştur
            const newRole = await guild.roles.create({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                permissions: role.permissions,
                mentionable: role.mentionable,
                position: role.position,
                reason: 'Guard olmayan biri tarafından silindiği için geri oluşturuldu.'
            });

            // SQL log kaydı
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'roleDelete',
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
                .setTitle('🚨 İzinsiz Rol Silme Engellendi')
                .setDescription(`Guard listesinde olmayan bir kullanıcı bir rolü sildi, rol geri oluşturuldu!`)
                .addFields(
                    { name: 'Silen', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Rol', value: `${role.name} (${role.id})`, inline: true },
                    { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [roleDelete] İzinsiz rol silme engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [roleDelete] Hata:', error);
        }
    }
}; 