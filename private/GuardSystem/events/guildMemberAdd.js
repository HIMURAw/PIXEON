const { pool } = require('../../DB/connect');
const { EmbedBuilder } = require('discord.js');

// Son girişleri tutmak için basit bir bellek
const recentJoins = new Map();

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    /**
     * @param {import('discord.js').GuildMember} member
     */
    async execute(member) {
        try {
            const guild = member.guild;
            const now = Date.now();
            if (!recentJoins.has(guild.id)) recentJoins.set(guild.id, []);
            const joins = recentJoins.get(guild.id);
            // Eski girişleri temizle (10 saniyeden eski)
            const filtered = joins.filter(j => now - j.time < 10000);
            filtered.push({ id: member.id, time: now });
            recentJoins.set(guild.id, filtered);

            // Eğer 10 saniyede 5'ten fazla giriş varsa hepsini banla
            if (filtered.length >= 5) {
                for (const join of filtered) {
                    try {
                        const m = await guild.members.fetch(join.id);
                        await m.ban({ reason: 'Anti-raid: Toplu giriş tespit edildi.' });
                        // Logu veritabanına kaydet
                        await pool.query(
                            'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [
                                'guildMemberAdd',
                                'ban-raid',
                                m.id,
                                m.user.tag,
                                guild.id,
                                guild.name,
                                JSON.stringify({ reason: 'Toplu giriş tespit edildi', timestamp: now })
                            ]
                        );
                    } catch (err) {
                        // Banlanamayanlar için log
                        await pool.query(
                            'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [
                                'guildMemberAdd',
                                'ban-fail',
                                join.id,
                                '-',
                                guild.id,
                                guild.name,
                                JSON.stringify({ error: err.message, timestamp: now })
                            ]
                        );
                    }
                }
                // Discord'a embed log gönder
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('🚨 Anti-Raid: Toplu Giriş Tespit Edildi')
                    .setDescription(`${filtered.length} kullanıcı 10 saniye içinde sunucuya katıldı ve otomatik olarak banlandı.`)
                    .addFields(
                        { name: 'Sunucu', value: `${guild.name} (${guild.id})`, inline: true },
                        { name: 'Zaman', value: `<t:${Math.floor(now / 1000)}:F>`, inline: true }
                    )
                    .setTimestamp();
                const logChannel = guild.systemChannel || guild.channels.cache.find(c => c.type === 0); // ilk text kanal
                if (logChannel) logChannel.send({ embeds: [embed] });
                // Belleği temizle
                recentJoins.set(guild.id, []);
            }
        } catch (error) {
            console.error('[PX-Guard][Anti-Raid] guildMemberAdd Hata:', error);
        }
    }
}; 