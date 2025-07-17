const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guard-update')
        .setDescription('Guard kullanıcısının seviyesini veya durumunu günceller')
        .addUserOption(option =>
            option.setName('kullanici')
                .setDescription('Güncellenecek guard kullanıcısı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('islem')
                .setDescription('Yapılacak işlem')
                .setRequired(true)
                .addChoices(
                    { name: '🔄 Seviye Değiştir', value: 'level' },
                    { name: '📊 Durum Değiştir', value: 'status' },
                    { name: '📝 Not Güncelle', value: 'note' }
                ))
        .addStringOption(option =>
            option.setName('yeni_deger')
                .setDescription('Yeni seviye, durum veya not')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Güncelleme sebebi (opsiyonel)')
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
                        .setDescription('Guard sisteminde hiç kullanıcı yokken sadece sistem sahibi guard kullanıcısı güncelleyebilir!')
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
                
                // Sadece full guard seviyesi kullanıcılar güncelleyebilir
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
            const operation = interaction.options.getString('islem');
            const newValue = interaction.options.getString('yeni_deger');
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

            const currentUser = existingUser[0];
            let updateQuery = '';
            let updateParams = [];
            let oldValue = '';
            let newValueValidated = '';

            // İşlem türüne göre güncelleme
            switch (operation) {
                case 'level':
                    // Seviye değiştirme
                    const validLevels = ['basic', 'moderator', 'admin', 'full'];
                    if (!validLevels.includes(newValue.toLowerCase())) {
                        const errorEmbed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle('❌ Hata')
                            .setDescription('Geçersiz seviye! Geçerli seviyeler: basic, moderator, admin, full')
                            .setTimestamp()
                            .setFooter({ text: 'PX Development Guard Bot' });

                        return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                    }

                    oldValue = currentUser.guard_level;
                    newValueValidated = newValue.toLowerCase();
                    updateQuery = 'UPDATE discord_guard_users SET guard_level = ?, updated_at = NOW() WHERE user_id = ?';
                    updateParams = [newValueValidated, targetUser.id];
                    break;

                case 'status':
                    // Durum değiştirme
                    const validStatuses = ['active', 'inactive', 'banned'];
                    if (!validStatuses.includes(newValue.toLowerCase())) {
                        const errorEmbed = new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle('❌ Hata')
                            .setDescription('Geçersiz durum! Geçerli durumlar: active, inactive, banned')
                            .setTimestamp()
                            .setFooter({ text: 'PX Development Guard Bot' });

                        return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
                    }

                    oldValue = currentUser.status;
                    newValueValidated = newValue.toLowerCase();
                    updateQuery = 'UPDATE discord_guard_users SET status = ?, updated_at = NOW() WHERE user_id = ?';
                    updateParams = [newValueValidated, targetUser.id];
                    break;

                case 'note':
                    // Not güncelleme
                    oldValue = currentUser.notes || 'Not yok';
                    newValueValidated = newValue;
                    updateQuery = 'UPDATE discord_guard_users SET notes = ?, updated_at = NOW() WHERE user_id = ?';
                    updateParams = [newValueValidated, targetUser.id];
                    break;

                default:
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('❌ Hata')
                        .setDescription('Geçersiz işlem türü!')
                        .setTimestamp()
                        .setFooter({ text: 'PX Development Guard Bot' });

                    return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
            }

            // Veritabanını güncelle
            await pool.query(updateQuery, updateParams);

            // Log kaydet
            const actionMap = {
                'level': 'update',
                'status': 'update',
                'note': 'update'
            };

            await pool.query(
                `INSERT INTO discord_guard_logs 
                (user_id, username, action, old_level, new_level, moderator_id, moderator_username, reason) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    targetUser.id,
                    targetUser.tag,
                    actionMap[operation],
                    operation === 'level' ? oldValue : null,
                    operation === 'level' ? newValueValidated : null,
                    interaction.user.id,
                    interaction.user.tag,
                    reason
                ]
            );

            // Güncellenmiş kullanıcı bilgilerini al
            const [updatedUser] = await pool.query(
                'SELECT * FROM discord_guard_users WHERE user_id = ?',
                [targetUser.id]
            );

            // Başarı embed'i oluştur
            const successEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('✅ Guard Kullanıcısı Güncellendi')
                .setDescription(`${targetUser} başarıyla güncellendi!`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '👤 Kullanıcı', value: `${targetUser.tag}`, inline: true },
                    { name: '🆔 ID', value: targetUser.id, inline: true },
                    { name: '👮 Güncelleyen', value: interaction.user.tag, inline: true },
                    { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                    { name: '🔄 İşlem', value: getOperationName(operation), inline: true },
                    { name: '📝 Sebep', value: reason, inline: true },
                    { name: '📊 Güncel Bilgiler', value: getCurrentInfo(updatedUser[0]), inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            await interaction.reply({ embeds: [successEmbed], flags: 64 });

            console.log(`\x1b[32m[PX-Guard]\x1b[0m Guard kullanıcısı güncellendi: ${targetUser.tag} (${operation}: ${oldValue} → ${newValueValidated})`);

            // Webhook logu gönder
            await webhookLogger.logUserUpdate({
                targetUser,
                moderator: interaction.user,
                operationName: getOperationName(operation),
                reason,
                oldValue,
                newValue: newValueValidated,
                currentInfo: getCurrentInfo(updatedUser[0])
            });

        } catch (error) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m Guard güncelleme hatası:', error);
            
            // Hata webhook logu gönder
            await webhookLogger.logError({
                user: interaction.user,
                operation: 'guard_update',
                error
            });
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Hata')
                .setDescription('Guard kullanıcısı güncellenirken bir hata oluştu!')
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            await interaction.reply({ embeds: [errorEmbed], flags: 64 });
        }
    }
};

function getOperationName(operation) {
    const operationNames = {
        'level': '🔄 Seviye Değiştirme',
        'status': '📊 Durum Değiştirme',
        'note': '📝 Not Güncelleme'
    };
    return operationNames[operation] || operation;
}

function getCurrentInfo(user) {
    const levelNames = {
        'basic': '🔰 Temel Guard',
        'moderator': '🛡️ Moderator Guard',
        'admin': '⚡ Admin Guard',
        'full': '👑 Full Guard'
    };
    
    const statusNames = {
        'active': '✅ Aktif',
        'inactive': '❌ Pasif',
        'banned': '🚫 Yasaklı'
    };
    
    return `🛡️ Seviye: ${levelNames[user.guard_level]}\n📊 Durum: ${statusNames[user.status]}\n📝 Not: ${user.notes || 'Not yok'}`;
} 