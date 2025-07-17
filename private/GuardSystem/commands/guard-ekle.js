const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } = require('discord.js');
const { pool } = require('../../DB/connect');
const Config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guard-ekle')
        .setDescription('Guard sistemine kullanıcı ekler')
        .addUserOption(option =>
            option.setName('kullanici')
                .setDescription('Guard sistemine eklenecek kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('not')
                .setDescription('Kullanıcı hakkında not (opsiyonel)')
                .setRequired(false))
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
                        .setDescription('Guard sisteminde hiç kullanıcı yokken sadece sistem sahibi guard kullanıcısı ekleyebilir!')
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
                
                // Sadece full guard seviyesi kullanıcılar ekleyebilir
                if (userGuard[0].guard_level !== 'full') {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('❌ Yetkisiz Erişim')
                        .setDescription('Bu komutu kullanmak için Full Guard seviyesinde olmanız gerekiyor!')
                        .setTimestamp()
                        .setFooter({ text: 'PX Development Guard Bot' });

                    return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                }
            }

            const targetUser = interaction.options.getUser('kullanici');
            const note = interaction.options.getString('not') || 'Not belirtilmedi';
            
            // Kullanıcının zaten guard sisteminde olup olmadığını kontrol et
            const [existingUser] = await pool.query(
                'SELECT * FROM discord_guard_users WHERE user_id = ?',
                [targetUser.id]
            );

            if (existingUser.length > 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('❌ Hata')
                    .setDescription(`${targetUser} zaten guard sisteminde bulunuyor!`)
                    .setTimestamp()
                    .setFooter({ text: 'PX Development Guard Bot' });

                return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
            }

            // Guard seviyeleri ve yetkileri
            const guardLevels = {
                basic: {
                    name: '🔰 Temel Guard',
                    description: 'Temel güvenlik yetkileri',
                    permissions: [
                        'Mesaj spam kontrolü',
                        'Zararlı link engelleme',
                        'Caps kontrolü'
                    ]
                },
                moderator: {
                    name: '🛡️ Moderator Guard',
                    description: 'Orta seviye moderasyon yetkileri',
                    permissions: [
                        'Temel guard yetkileri',
                        'Kullanıcı uyarı sistemi',
                        'Geçici susturma',
                        'Mesaj silme'
                    ]
                },
                admin: {
                    name: '⚡ Admin Guard',
                    description: 'Yüksek seviye yönetim yetkileri',
                    permissions: [
                        'Moderator yetkileri',
                        'Kullanıcı ban/unban',
                        'Rol yönetimi',
                        'Kanal yönetimi',
                        'Sunucu ayarları'
                    ]
                },
                full: {
                    name: '👑 Full Guard',
                    description: 'Tam yetki - Tüm guard özellikleri',
                    permissions: [
                        'Admin yetkileri',
                        'Guard kullanıcı yönetimi',
                        'Sistem ayarları',
                        'Log yönetimi',
                        'Tam kontrol'
                    ]
                }
            };

            // Embed oluştur
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('🛡️ Guard Sistemi - Kullanıcı Ekleme')
                .setDescription(`${targetUser} guard sistemine eklenmek üzere. Aşağıdan bir seviye seçin:`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '👤 Kullanıcı', value: `${targetUser.tag}`, inline: true },
                    { name: '🆔 ID', value: targetUser.id, inline: true },
                    { name: '📝 Not', value: note, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            // Seviye seçeneklerini ekle
            Object.entries(guardLevels).forEach(([level, info]) => {
                embed.addFields({
                    name: info.name,
                    value: `**${info.description}**\n${info.permissions.map(perm => `• ${perm}`).join('\n')}`,
                    inline: false
                });
            });

            // Select menu oluştur
            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`guard_add_${targetUser.id}`)
                        .setPlaceholder('Guard seviyesi seçin...')
                        .addOptions([
                            {
                                label: '🔰 Temel Guard',
                                description: 'Temel güvenlik yetkileri',
                                value: 'basic',
                                emoji: '🔰'
                            },
                            {
                                label: '🛡️ Moderator Guard',
                                description: 'Orta seviye moderasyon yetkileri',
                                value: 'moderator',
                                emoji: '🛡️'
                            },
                            {
                                label: '⚡ Admin Guard',
                                description: 'Yüksek seviye yönetim yetkileri',
                                value: 'admin',
                                emoji: '⚡'
                            },
                            {
                                label: '👑 Full Guard',
                                description: 'Tam yetki - Tüm guard özellikleri',
                                value: 'full',
                                emoji: '👑'
                            }
                        ])
                );

            await interaction.reply({ embeds: [embed], components: [selectMenu], flags: 64 });

        } catch (error) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m Guard ekleme hatası:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Hata')
                .setDescription('Guard kullanıcısı eklenirken bir hata oluştu!')
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            await interaction.reply({ embeds: [errorEmbed], flags: 64 });
        }
    }
}; 