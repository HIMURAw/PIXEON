const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guard-sil')
        .setDescription('Guard sisteminden kullanıcı siler')
        .addUserOption(option =>
            option.setName('kullanici')
                .setDescription('Guard sisteminden silinecek kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Silme sebebi (opsiyonel)')
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
                        .setDescription('Guard sisteminde hiç kullanıcı yokken sadece sistem sahibi guard kullanıcısı silebilir!')
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
                
                // Sadece full guard seviyesi kullanıcılar silebilir
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
            const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
            
            // Kullanıcının guard sisteminde olup olmadığını kontrol et
            const [existingUser] = await pool.query(
                'SELECT * FROM discord_guard_users WHERE user_id = ?',
                [targetUser.id]
            );

            if (existingUser.length === 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('❌ Hata')
                    .setDescription(`${targetUser} guard sisteminde bulunmuyor!`)
                    .setTimestamp()
                    .setFooter({ text: 'PX Development Guard Bot' });

                return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
            }

            const userToDelete = existingUser[0];

            // Onay embed'i oluştur
            const confirmEmbed = new EmbedBuilder()
                .setColor(0xff6b6b)
                .setTitle('⚠️ Guard Kullanıcısı Silme Onayı')
                .setDescription(`${targetUser} guard sisteminden silinecek. Bu işlem geri alınamaz!`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '👤 Kullanıcı', value: `${targetUser.tag}`, inline: true },
                    { name: '🆔 ID', value: targetUser.id, inline: true },
                    { name: '🛡️ Mevcut Seviye', value: getLevelName(userToDelete.guard_level), inline: true },
                    { name: '📊 Mevcut Durum', value: getStatusName(userToDelete.status), inline: true },
                    { name: '👮 Silen', value: interaction.user.tag, inline: true },
                    { name: '📝 Sebep', value: reason, inline: true },
                    { name: '⚠️ Uyarı', value: 'Bu işlem geri alınamaz! Kullanıcı tüm guard yetkilerini kaybedecek.', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            // Onay butonları oluştur
            const confirmButton = new ButtonBuilder()
                .setCustomId(`guard_delete_confirm_${targetUser.id}`)
                .setLabel('Evet, Sil')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🗑️');

            const cancelButton = new ButtonBuilder()
                .setCustomId(`guard_delete_cancel_${targetUser.id}`)
                .setLabel('İptal')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('❌');

            const confirmRow = new ActionRowBuilder()
                .addComponents(confirmButton, cancelButton);

            await interaction.reply({ 
                embeds: [confirmEmbed], 
                components: [confirmRow],
                flags: 64 
            });

        } catch (error) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m Guard silme hatası:', error);
            
            // Hata webhook logu gönder
            await webhookLogger.logError({
                user: interaction.user,
                operation: 'guard_delete',
                error
            });
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Hata')
                .setDescription('Guard kullanıcısı silme işlemi sırasında bir hata oluştu!')
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            await interaction.reply({ embeds: [errorEmbed], flags: 64 });
        }
    }
};

function getLevelName(level) {
    const levelNames = {
        'basic': '🔰 Temel Guard',
        'moderator': '🛡️ Moderator Guard',
        'admin': '⚡ Admin Guard',
        'full': '👑 Full Guard'
    };
    return levelNames[level] || level;
}

function getStatusName(status) {
    const statusNames = {
        'active': '✅ Aktif',
        'inactive': '❌ Pasif',
        'banned': '🚫 Yasaklı'
    };
    return statusNames[status] || status;
} 