const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    /**
     * @param {import('discord.js').GuildMember} member
     */
    async execute(member) {
        try {
            if (!member.user.bot) return; // Sadece botlar için
            const guild = member.guild;
            // Son ekleyen kişiyi audit logdan bul
            const fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.BotAdd
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

            // Guard değilse botu at
            await member.kick('Guard olmayan biri tarafından bot eklendiği için atıldı.');

            // SQL log kaydı
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'botAdd',
                    'block',
                    executor.id,
                    executor.tag,
                    member.user.id,
                    member.user.tag,
                    JSON.stringify({ guildId: guild.id, guildName: guild.name })
                ]
            );

            // Logla
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🤖 İzinsiz Bot Ekleme Engellendi')
                .setDescription('Guard listesinde olmayan bir kullanıcı sunucuya bot ekledi, bot atıldı!')
                .addFields(
                    { name: 'Ekleyen', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Bot', value: `${member.user.tag} (${member.user.id})`, inline: true },
                    { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [guildMemberAdd] İzinsiz bot ekleme engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [guildMemberAdd][Bot Ekleme] Hata:', error);
        }
    }
}; 