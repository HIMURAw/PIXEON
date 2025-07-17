const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildUpdate',
    once: false,
    /**
     * @param {import('discord.js').Guild} oldGuild
     * @param {import('discord.js').Guild} newGuild
     */
    async execute(oldGuild, newGuild) {
        try {
            // Audit logdan son değişikliği yapanı bul
            const fetchedLogs = await newGuild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.GuildUpdate
            });
            const auditEntry = fetchedLogs.entries.first();
            if (!auditEntry) return;
            const executor = auditEntry.executor;
            if (!executor || executor.bot) return; // Botlar hariç

            // Guard listesinde mi kontrol et
            const [userGuard] = await pool.query(
                'SELECT guard_level FROM discord_guard_users WHERE user_id = ? AND status = "active"',
                [executor.id]
            );
            if (userGuard.length > 0) return; // Guard ise izin ver

            // Guard değilse değişikliği geri al
            await newGuild.edit({
                name: oldGuild.name,
                icon: oldGuild.iconURL(),
                banner: oldGuild.bannerURL(),
                description: oldGuild.description,
                verificationLevel: oldGuild.verificationLevel,
                explicitContentFilter: oldGuild.explicitContentFilter,
                afkChannel: oldGuild.afkChannel,
                afkTimeout: oldGuild.afkTimeout,
                systemChannel: oldGuild.systemChannel,
                systemChannelFlags: oldGuild.systemChannelFlags,
                rulesChannel: oldGuild.rulesChannel,
                publicUpdatesChannel: oldGuild.publicUpdatesChannel,
                preferredLocale: oldGuild.preferredLocale
            });

            // Logu veritabanına kaydet
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'guildUpdate',
                    'revert',
                    executor.id,
                    executor.tag,
                    newGuild.id,
                    newGuild.name,
                    JSON.stringify({ old: {
                        name: oldGuild.name,
                        icon: oldGuild.iconURL(),
                        banner: oldGuild.bannerURL(),
                        description: oldGuild.description,
                        verificationLevel: oldGuild.verificationLevel,
                        explicitContentFilter: oldGuild.explicitContentFilter,
                        afkChannel: oldGuild.afkChannel?.id,
                        afkTimeout: oldGuild.afkTimeout,
                        systemChannel: oldGuild.systemChannel?.id,
                        systemChannelFlags: oldGuild.systemChannelFlags,
                        rulesChannel: oldGuild.rulesChannel?.id,
                        publicUpdatesChannel: oldGuild.publicUpdatesChannel?.id,
                        preferredLocale: oldGuild.preferredLocale
                    }, new: {
                        name: newGuild.name,
                        icon: newGuild.iconURL(),
                        banner: newGuild.bannerURL(),
                        description: newGuild.description,
                        verificationLevel: newGuild.verificationLevel,
                        explicitContentFilter: newGuild.explicitContentFilter,
                        afkChannel: newGuild.afkChannel?.id,
                        afkTimeout: newGuild.afkTimeout,
                        systemChannel: newGuild.systemChannel?.id,
                        systemChannelFlags: newGuild.systemChannelFlags,
                        rulesChannel: newGuild.rulesChannel?.id,
                        publicUpdatesChannel: newGuild.publicUpdatesChannel?.id,
                        preferredLocale: newGuild.preferredLocale
                    } })
                ]
            );

            // Logla
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Yetkisiz Sunucu Değişikliği Geri Alındı')
                .setDescription(`Guard listesinde olmayan bir kullanıcı sunucu ayarlarını değiştirdi ve değişiklik geri alındı.`)
                .addFields(
                    { name: 'Kullanıcı', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Sunucu', value: `${newGuild.name} (${newGuild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [guildUpdate] Yetkisiz değişiklik geri alındı: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [guildUpdate] Hata:', error);
        }
    }
}; 