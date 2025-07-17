const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guard-list')
        .setDescription('Guard sistemindeki kullanıcıları listeler')
        .addStringOption(option =>
            option.setName('seviye')
                .setDescription('Belirli bir seviyeyi filtrele (opsiyonel)')
                .setRequired(false)
                .addChoices(
                    { name: '🔰 Temel Guard', value: 'basic' },
                    { name: '🛡️ Moderator Guard', value: 'moderator' },
                    { name: '⚡ Admin Guard', value: 'admin' },
                    { name: '👑 Full Guard', value: 'full' }
                ))
        .addStringOption(option =>
            option.setName('durum')
                .setDescription('Belirli bir durumu filtrele (opsiyonel)')
                .setRequired(false)
                .addChoices(
                    { name: '✅ Aktif', value: 'active' },
                    { name: '❌ Pasif', value: 'inactive' },
                    { name: '🚫 Yasaklı', value: 'banned' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            // Önce guard sisteminde hiç kullanıcı var mı kontrol et
            const [guardUsers] = await pool.query('SELECT COUNT(*) as count FROM discord_guard_users');
            const hasGuardUsers = guardUsers[0].count > 0;
            
            // Eğer hiç guard kullanıcısı yoksa, sadece owner kullanabilir
            if (!hasGuardUsers) {
                const config = require('../../../config.js');
                const ownerId = config.discord.guardBot.guard_owner_id;
                const userId = interaction.user.id;
                
                // String olarak karşılaştır
                if (userId !== ownerId) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('❌ Yetkisiz Erişim')
                        .setDescription('Guard sisteminde hiç kullanıcı yokken sadece sistem sahibi guard listesini görüntüleyebilir!')
                        .addFields(
                            { name: '👤 Kullanıcı ID', value: userId, inline: true },
                            { name: '👑 Owner ID', value: ownerId, inline: true },
                            { name: '🔍 Tip Kontrolü', value: `User: ${typeof userId}, Owner: ${typeof ownerId}`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: 'PX Development Guard Bot' });

                    return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                }
            } else {
                // Guard kullanıcıları varsa, sadece guard kullanıcıları kullanabilir
                const [userGuard] = await pool.query(
                    'SELECT guard_level FROM discord_guard_users WHERE user_id = ? AND status = "active"',
                    [interaction.user.id]
                );
                
                if (userGuard.length === 0) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('❌ Yetkisiz Erişim')
                        .setDescription('Bu komutu kullanmak için guard sisteminde aktif olmanız gerekiyor!')
                        .setTimestamp()
                        .setFooter({ text: 'PX Development Guard Bot' });

                    return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                }
            }

            const levelFilter = interaction.options.getString('seviye');
            const statusFilter = interaction.options.getString('durum');
            
            // SQL sorgusu oluştur
            let query = 'SELECT * FROM discord_guard_users';
            let params = [];
            let conditions = [];
            
            if (levelFilter) {
                conditions.push('guard_level = ?');
                params.push(levelFilter);
            }
            
            if (statusFilter) {
                conditions.push('status = ?');
                params.push(statusFilter);
            }
            
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }
            
            query += ' ORDER BY created_at DESC';
            
            const [users] = await pool.query(query, params);
            
            if (users.length === 0) {
                const noUsersEmbed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setTitle('📋 Guard Kullanıcı Listesi')
                    .setDescription('Guard sisteminde kullanıcı bulunamadı.')
                    .setTimestamp()
                    .setFooter({ text: 'PX Development Guard Bot' });
                
                return await interaction.reply({ embeds: [noUsersEmbed], flags: 64 });
            }
            
            // Guard seviyeleri için renkler ve emojiler
            const levelInfo = {
                basic: { emoji: '🔰', color: 0x00ff00, name: 'Temel Guard' },
                moderator: { emoji: '🛡️', color: 0x0099ff, name: 'Moderator Guard' },
                admin: { emoji: '⚡', color: 0xff6600, name: 'Admin Guard' },
                full: { emoji: '👑', color: 0xff00ff, name: 'Full Guard' }
            };
            
            // Durum emojileri
            const statusEmojis = {
                active: '✅',
                inactive: '❌',
                banned: '🚫'
            };
            
            // Kullanıcıları grupla
            const groupedUsers = {};
            users.forEach(user => {
                if (!groupedUsers[user.guard_level]) {
                    groupedUsers[user.guard_level] = [];
                }
                groupedUsers[user.guard_level].push(user);
            });
            
            // Ana embed oluştur
            const mainEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('📋 Guard Kullanıcı Listesi')
                .setDescription(`Toplam **${users.length}** kullanıcı bulundu.`)
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });
            
            // İstatistikler
            const stats = {
                basic: users.filter(u => u.guard_level === 'basic').length,
                moderator: users.filter(u => u.guard_level === 'moderator').length,
                admin: users.filter(u => u.guard_level === 'admin').length,
                full: users.filter(u => u.guard_level === 'full').length,
                active: users.filter(u => u.status === 'active').length,
                inactive: users.filter(u => u.status === 'inactive').length,
                banned: users.filter(u => u.status === 'banned').length
            };
            
            mainEmbed.addFields(
                { 
                    name: '📊 Seviye Dağılımı', 
                    value: `🔰 Temel: **${stats.basic}**\n🛡️ Moderator: **${stats.moderator}**\n⚡ Admin: **${stats.admin}**\n👑 Full: **${stats.full}**`, 
                    inline: true 
                },
                { 
                    name: '📈 Durum Dağılımı', 
                    value: `✅ Aktif: **${stats.active}**\n❌ Pasif: **${stats.inactive}**\n🚫 Yasaklı: **${stats.banned}**`, 
                    inline: true 
                }
            );
            
            // Her seviye için ayrı embed oluştur
            const embeds = [mainEmbed];
            
            Object.entries(groupedUsers).forEach(([level, levelUsers]) => {
                const levelData = levelInfo[level];
                const levelEmbed = new EmbedBuilder()
                    .setColor(levelData.color)
                    .setTitle(`${levelData.emoji} ${levelData.name} Kullanıcıları`)
                    .setDescription(`${levelUsers.length} kullanıcı bulundu.`);
                
                // Kullanıcıları listele (maksimum 10 kullanıcı)
                const userList = levelUsers.slice(0, 10).map(user => {
                    const statusEmoji = statusEmojis[user.status];
                    const addedDate = new Date(user.created_at).toLocaleDateString('tr-TR');
                    return `${statusEmoji} **${user.username}** (${user.user_id})\n└ Eklenme: ${addedDate}`;
                }).join('\n\n');
                
                levelEmbed.addFields({
                    name: '👥 Kullanıcılar',
                    value: userList || 'Kullanıcı bulunamadı.',
                    inline: false
                });
                
                if (levelUsers.length > 10) {
                    levelEmbed.addFields({
                        name: '📄 Not',
                        value: `Daha fazla kullanıcı var. Toplam: ${levelUsers.length}`,
                        inline: false
                    });
                }
                
                embeds.push(levelEmbed);
            });
            
            // Embed'leri gönder (maksimum 10 embed Discord limiti)
            const embedsToSend = embeds.slice(0, 10);
            
            if (embedsToSend.length === 1) {
                await interaction.reply({ embeds: embedsToSend, flags: 64 });
            } else {
                await interaction.reply({ 
                    content: `📋 Guard kullanıcı listesi (${embedsToSend.length} sayfa)`,
                    embeds: embedsToSend, 
                    flags: 64 
                });
            }
            
            console.log(`\x1b[36m[PX-Guard]\x1b[0m Guard listesi görüntülendi: ${users.length} kullanıcı`);
            
            // Webhook logu gönder
            const filters = [];
            if (levelFilter) filters.push(`Seviye: ${levelFilter}`);
            if (statusFilter) filters.push(`Durum: ${statusFilter}`);
            
            const statsText = `🔰 Temel: ${stats.basic} | 🛡️ Moderator: ${stats.moderator} | ⚡ Admin: ${stats.admin} | 👑 Full: ${stats.full}`;
            
            await webhookLogger.logUserList({
                viewer: interaction.user,
                totalUsers: users.length,
                filters: filters.length > 0 ? filters.join(', ') : 'Filtre yok',
                stats: statsText
            });
            
        } catch (error) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m Guard listesi hatası:', error);
            
            // Hata webhook logu gönder
            await webhookLogger.logError({
                user: interaction.user,
                operation: 'guard_list',
                error
            });
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Hata')
                .setDescription('Guard kullanıcı listesi alınırken bir hata oluştu!')
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            await interaction.reply({ embeds: [errorEmbed], flags: 64 });
        }
    }
}; 