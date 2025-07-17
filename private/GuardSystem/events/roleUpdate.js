const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');
const { AuditLogEvent, EmbedBuilder, PermissionsBitField } = require('discord.js');

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

            // Botun yetkisi var mı kontrol et
            const botMember = await newMember.guild.members.fetchMe();
            let allRemoved = true;
            let failedRoles = [];
            for (const role of addedRoles.values()) {
                if (botMember.roles.highest.comparePositionTo(role) > 0 && botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    try {
                        await newMember.roles.remove(role, 'Guard listesinde olmayan biri tarafından rol verildiği için geri alındı.');
                    } catch (err) {
                        allRemoved = false;
                        failedRoles.push(role.name + ' (' + role.id + ')');
                    }
                } else {
                    allRemoved = false;
                    failedRoles.push(role.name + ' (' + role.id + ')');
                }
            }

            // Logu veritabanına kaydet
            await pool.query(
                'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    'guildMemberUpdate',
                    allRemoved ? 'block' : 'fail',
                    executor.id,
                    executor.tag,
                    newMember.id,
                    newMember.user.tag,
                    JSON.stringify({ addedRoles: addedRoles.map(r => ({ id: r.id, name: r.name })), failedRoles, guildId: newMember.guild.id, guildName: newMember.guild.name })
                ]
            );

            // Logla
            const embed = new EmbedBuilder()
                .setColor(allRemoved ? 0xff0000 : 0xffa500)
                .setTitle(allRemoved ? '❌ Yetkisiz Rol Verme Engellendi' : '⚠️ Yetkisiz Rol Verme - Eksik Yetki')
                .setDescription(allRemoved
                    ? `Guard listesinde olmayan bir kullanıcı bir üyeye rol verdi ve rol geri alındı.`
                    : `Guard listesinde olmayan bir kullanıcı bir üyeye rol verdi fakat bazı roller geri alınamadı!`)
                .addFields(
                    { name: 'Kullanıcı', value: `${executor.tag} (${executor.id})`, inline: true },
                    { name: 'Hedef Üye', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
                    { name: 'Eklenen Roller', value: addedRoles.map(r => `${r.name} (${r.id})`).join(', '), inline: false },
                    { name: 'Sunucu', value: `${newMember.guild.name} (${newMember.guild.id})`, inline: true },
                    { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                );
            if (!allRemoved) {
                embed.addFields({ name: 'Geri Alınamayan Roller', value: failedRoles.join(', '), inline: false });
                embed.setFooter({ text: 'Botun rolü yeterli değil veya Manage Roles izni yok!' });
            }
            embed.setTimestamp();
            await webhookLogger.sendWebhook(embed);
            console.log(`[PX-Guard] [guildMemberUpdate] Yetkisiz rol verme engellendi: ${executor.tag}`);
        } catch (error) {
            console.error('[PX-Guard] [guildMemberUpdate] Hata:', error);
        }
    }
}; 