const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder } = require('discord.js');

// Son 10 saniyede kim, kime rol verdi bilgisini tutan Map
const roleGrantMap = new Map();
const MASS_ROLE_LIMIT = 3; // 10 saniyede 3 farklı üyeye rol verilirse
const MASS_ROLE_INTERVAL = 10 * 1000; // 10 saniye

module.exports = {
    name: 'guildMemberUpdate',
    once: false,
    /**
     * @param {import('discord.js').GuildMember} oldMember
     * @param {import('discord.js').GuildMember} newMember
     */
    async execute(oldMember, newMember) {
        try {
            // Rol eklenmiş mi kontrol et
            const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
            if (addedRoles.size === 0) return;

            // Son rol ekleme işlemini yapanı bul
            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberRoleUpdate
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

            // Toplu rol verme kontrolü
            const now = Date.now();
            if (!roleGrantMap.has(executor.id)) roleGrantMap.set(executor.id, []);
            const grants = roleGrantMap.get(executor.id);
            grants.push({ userId: newMember.id, time: now });
            // Sadece son MASS_ROLE_INTERVAL içindeki işlemleri tut
            const recent = grants.filter(g => now - g.time < MASS_ROLE_INTERVAL);
            roleGrantMap.set(executor.id, recent);
            // Farklı üyeler sayısı
            const uniqueUsers = new Set(recent.map(g => g.userId));
            if (uniqueUsers.size >= MASS_ROLE_LIMIT) {
                // Tüm eklenen rolleri geri al
                for (const g of recent) {
                    try {
                        const member = await newMember.guild.members.fetch(g.userId);
                        for (const role of addedRoles.values()) {
                            await member.roles.remove(role, 'Toplu rol/yetki dağıtımı engellendi.');
                        }
                    } catch (err) {
                        // Hata olursa logla ama devam et
                        console.log('[PX-Guard] Toplu rol geri alınırken hata:', err);
                    }
                }
                // SQL log kaydı
                await pool.query(
                    'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        'massRoleGrant',
                        'block',
                        executor.id,
                        executor.tag,
                        '-',
                        '-',
                        JSON.stringify({ guildId: newMember.guild.id, guildName: newMember.guild.name, affectedUsers: Array.from(uniqueUsers) })
                    ]
                );
                // Logla
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('🚨 Toplu Rol/Yetki Dağıtımı Engellendi')
                    .setDescription('Guard listesinde olmayan bir kullanıcı kısa sürede çok fazla üyeye rol verdi, roller geri alındı!')
                    .addFields(
                        { name: 'Dağıtan', value: `${executor.tag} (${executor.id})`, inline: true },
                        { name: 'Hedef Üye Sayısı', value: uniqueUsers.size.toString(), inline: true },
                        { name: 'Sunucu', value: `${newMember.guild.name} (${newMember.guild.id})`, inline: true },
                        { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                    )
                    .setTimestamp();
                await webhookLogger.sendWebhook(embed);
                console.log(`[PX-Guard] [guildMemberUpdate] Toplu rol/yetki dağıtımı engellendi: ${executor.tag}`);
                // Olaydan sonra bu executor için kaydı temizle
                roleGrantMap.set(executor.id, []);
            }
        } catch (error) {
            console.error('[PX-Guard] [guildMemberUpdate][Toplu Rol] Hata:', error);
        }
    }
}; 