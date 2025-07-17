const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildAuditLogEntryCreate',
    once: false,
    /**
     * @param {import('discord.js').GuildAuditLogsEntry} auditLogEntry
     * @param {import('discord.js').Guild} guild
     */
    async execute(auditLogEntry, guild) {
        try {
            // Sadece webhook işlemlerini kontrol et
            if (![AuditLogEvent.WebhookCreate, AuditLogEvent.WebhookDelete, AuditLogEvent.WebhookUpdate].includes(auditLogEntry.action)) return;
            const executor = auditLogEntry.executor;
            if (!executor || executor.bot) return;

            // Guard listesinde mi kontrol et
            const [userGuard] = await pool.query(
                'SELECT guard_level FROM discord_guard_users WHERE user_id = ? AND status = "active"',
                [executor.id]
            );
            if (userGuard.length > 0) return; // Guard ise izin ver

            // Webhook işlemini geri al (eklendiyse sil, silindiyse logla, güncellendiyse eski haline döndürmek mümkün değilse logla)
            let actionDesc = '';
            if (auditLogEntry.action === AuditLogEvent.WebhookCreate) {
                // Webhooku sil
                const webhook = await guild.fetchWebhook(auditLogEntry.target.id).catch(() => null);
                if (webhook) {
                    await webhook.delete('Guard olmayan biri tarafından oluşturulduğu için silindi.');
                    actionDesc = 'oluşturdu, webhook silindi';
                }
            } else if (auditLogEntry.action === AuditLogEvent.WebhookDelete) {
                actionDesc = 'sildi';
            } else if (auditLogEntry.action === AuditLogEvent.WebhookUpdate) {
                actionDesc = 'güncelledi';
            }

            // SQL log kaydı
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'webhookProtect',
                    'block',
                    executor.id,
                    executor.tag,
                    auditLogEntry.target.id,
                    auditLogEntry.target.name || '-',
                    JSON.stringify({ guildId: guild.id, guildName: guild.name, action: actionDesc })
                ]
            );

            // Logla
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🚨 İzinsiz Webhook İşlemi Engellendi')
                .setDescription(`Guard listesinde olmayan bir kullanıcı bir webhook üzerinde işlem yaptı (${actionDesc})!`)
                .addFields(
                    { name: 'Kullanıcı', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'İşlem', value: AuditLogEvent[auditLogEntry.action], inline: true },
                    { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [webhookProtect] İzinsiz webhook işlemi engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [webhookProtect] Hata:', error);
        }
    }
}; 