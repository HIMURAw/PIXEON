const { EmbedBuilder } = require('discord.js');
const { pool } = require('../../DB/connect');
const webhookLogger = require('../utils/webhookLogger');

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute(interaction) {
        // Select menu interaction'larını handle et
        if (interaction.isStringSelectMenu()) {
            handleSelectMenu(interaction);
        }
        
        // Button interaction'larını handle et
        if (interaction.isButton()) {
            handleButton(interaction);
        }
    }
};

async function handleSelectMenu(interaction) {
    try {
        const customId = interaction.customId;
        
        // Guard ekleme select menu'su
        if (customId.startsWith('guard_add_')) {
            await handleGuardAdd(interaction);
        }
        
    } catch (error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Select menu işleme hatası:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Hata')
            .setDescription('İşlem sırasında bir hata oluştu!')
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await interaction.reply({ embeds: [errorEmbed], flags: 64 });
    }
}

/**
 * Button interaction handler
 * @param {ButtonInteraction} interaction - Button interaction
 */
async function handleButton(interaction) {
    try {
        const customId = interaction.customId;
        
        // Guard silme onay butonu
        if (customId.startsWith('guard_delete_confirm_')) {
            await handleGuardDeleteConfirm(interaction);
        }
        
        // Guard silme iptal butonu
        if (customId.startsWith('guard_delete_cancel_')) {
            await handleGuardDeleteCancel(interaction);
        }
        
    } catch (error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Button işleme hatası:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Hata')
            .setDescription('İşlem sırasında bir hata oluştu!')
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        // Interaction zaten reply edilmişse followUp kullan
        try {
            await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
        } catch (followUpError) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m FollowUp hatası:', followUpError);
        }
    }
}

async function handleGuardAdd(interaction) {
    const customId = interaction.customId;
    const userId = customId.replace('guard_add_', '');
    const selectedLevel = interaction.values[0];
    
    // Kullanıcıyı al
    const targetUser = await interaction.client.users.fetch(userId);
    if (!targetUser) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Hata')
            .setDescription('Kullanıcı bulunamadı!')
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
    }
    
    // Guard seviyeleri ve yetkileri
    const guardLevels = {
        basic: {
            name: '🔰 Temel Guard',
            color: 0x00ff00,
            permissions: [
                'Mesaj spam kontrolü',
                'Zararlı link engelleme',
                'Caps kontrolü'
            ]
        },
        moderator: {
            name: '🛡️ Moderator Guard',
            color: 0x0099ff,
            permissions: [
                'Temel guard yetkileri',
                'Kullanıcı uyarı sistemi',
                'Geçici susturma',
                'Mesaj silme'
            ]
        },
        admin: {
            name: '⚡ Admin Guard',
            color: 0xff6600,
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
            color: 0xff00ff,
            permissions: [
                'Admin yetkileri',
                'Guard kullanıcı yönetimi',
                'Sistem ayarları',
                'Log yönetimi',
                'Tam kontrol'
            ]
        }
    };
    
    const selectedLevelInfo = guardLevels[selectedLevel];
    
    try {
        // Veritabanına kaydet
        await pool.query(
            `INSERT INTO discord_guard_users 
            (user_id, username, avatar_url, guard_level, permissions, added_by, added_by_username, status, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
            [
                targetUser.id,
                targetUser.tag,
                targetUser.displayAvatarURL({ dynamic: true }),
                selectedLevel,
                JSON.stringify(selectedLevelInfo.permissions),
                interaction.user.id,
                interaction.user.tag,
                'Guard sistemi tarafından eklendi'
            ]
        );
        
        // Log kaydet
        await pool.query(
            `INSERT INTO discord_guard_logs 
            (user_id, username, action, new_level, moderator_id, moderator_username, reason) 
            VALUES (?, ?, 'add', ?, ?, ?, ?)`,
            [
                targetUser.id,
                targetUser.tag,
                selectedLevel,
                interaction.user.id,
                interaction.user.tag,
                'Guard sistemi tarafından eklendi'
            ]
        );
        
        // Başarı embed'i oluştur
        const successEmbed = new EmbedBuilder()
            .setColor(selectedLevelInfo.color)
            .setTitle('✅ Guard Kullanıcısı Eklendi')
            .setDescription(`${targetUser} başarıyla guard sistemine eklendi!`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Kullanıcı', value: `${targetUser.tag}`, inline: true },
                { name: '🆔 ID', value: targetUser.id, inline: true },
                { name: '🛡️ Seviye', value: selectedLevelInfo.name, inline: true },
                { name: '👮 Ekleyen', value: interaction.user.tag, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '✅ Durum', value: 'Aktif', inline: true },
                { name: '🔐 Yetkiler', value: selectedLevelInfo.permissions.map(perm => `• ${perm}`).join('\n'), inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });
        
        await interaction.update({ 
            embeds: [successEmbed], 
            components: [] // Butonları tamamen kaldır
        });
        
        console.log(`\x1b[32m[PX-Guard]\x1b[0m Guard kullanıcısı eklendi: ${targetUser.tag} (${selectedLevel})`);
        
        // Webhook logu gönder
        await webhookLogger.logUserAdd({
            targetUser,
            levelInfo: selectedLevelInfo,
            moderator: interaction.user
        });
        
    } catch (error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Guard kullanıcısı ekleme hatası:', error);
        
        // Hata webhook logu gönder
        await webhookLogger.logError({
            user: interaction.user,
            operation: 'guard_add',
            error
        });
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Hata')
            .setDescription('Guard kullanıcısı eklenirken veritabanı hatası oluştu!')
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await interaction.reply({ embeds: [errorEmbed], flags: 64 });
    }
}

/**
 * Guard silme onay işlemi
 * @param {ButtonInteraction} interaction - Button interaction
 */
async function handleGuardDeleteConfirm(interaction) {
    const customId = interaction.customId;
    const userId = customId.replace('guard_delete_confirm_', '');
    
    try {
        // Kullanıcıyı al
        const targetUser = await interaction.client.users.fetch(userId);
        if (!targetUser) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Hata')
                .setDescription('Kullanıcı bulunamadı!')
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
        }
        
        // Kullanıcının guard bilgilerini al
        const [existingUser] = await pool.query(
            'SELECT * FROM discord_guard_users WHERE user_id = ?',
            [targetUser.id]
        );
        
        if (existingUser.length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('❌ Hata')
                .setDescription('Kullanıcı zaten guard sisteminde bulunmuyor!')
                .setTimestamp()
                .setFooter({ text: 'PX Development Guard Bot' });

            return await interaction.reply({ embeds: [errorEmbed], flags: 64 });
        }
        
        const userToDelete = existingUser[0];
        
        // Veritabanından sil
        await pool.query(
            'DELETE FROM discord_guard_users WHERE user_id = ?',
            [targetUser.id]
        );
        
        // Log kaydet
        await pool.query(
            `INSERT INTO discord_guard_logs 
            (user_id, username, action, old_level, moderator_id, moderator_username, reason) 
            VALUES (?, ?, 'remove', ?, ?, ?, ?)`,
            [
                targetUser.id,
                targetUser.tag,
                userToDelete.guard_level,
                interaction.user.id,
                interaction.user.tag,
                'Guard sistemi tarafından silindi'
            ]
        );
        
        // Başarı embed'i oluştur
        const successEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('🗑️ Guard Kullanıcısı Silindi')
            .setDescription(`${targetUser} guard sisteminden başarıyla silindi!`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Kullanıcı', value: `${targetUser.tag}`, inline: true },
                { name: '🆔 ID', value: targetUser.id, inline: true },
                { name: '👮 Silen', value: interaction.user.tag, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '🛡️ Eski Seviye', value: getLevelName(userToDelete.guard_level), inline: true },
                { name: '📊 Eski Durum', value: getStatusName(userToDelete.status), inline: true },
                { name: '⚠️ Not', value: 'Kullanıcı tüm guard yetkilerini kaybetti.', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });
        
        await interaction.update({ 
            embeds: [successEmbed], 
            components: [] // Butonları tamamen kaldır
        });
        
        console.log(`\x1b[32m[PX-Guard]\x1b[0m Guard kullanıcısı silindi: ${targetUser.tag}`);
        
        // Webhook logu gönder
        await webhookLogger.logUserRemove({
            targetUser,
            moderator: interaction.user,
            oldLevel: userToDelete.guard_level,
            oldStatus: userToDelete.status,
            reason: 'Guard sistemi tarafından silindi'
        });
        
    } catch (error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Guard silme hatası:', error);
        
        // Hata webhook logu gönder
        await webhookLogger.logError({
            user: interaction.user,
            operation: 'guard_delete_confirm',
            error
        });
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Hata')
            .setDescription('Guard kullanıcısı silinirken bir hata oluştu!')
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        // Interaction zaten reply edilmişse followUp kullan
        try {
            await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
        } catch (followUpError) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m FollowUp hatası:', followUpError);
        }
    }
}

/**
 * Guard silme iptal işlemi
 * @param {ButtonInteraction} interaction - Button interaction
 */
async function handleGuardDeleteCancel(interaction) {
    const customId = interaction.customId;
    const userId = customId.replace('guard_delete_cancel_', '');
    
    try {
        // Kullanıcıyı al
        const targetUser = await interaction.client.users.fetch(userId);
        
        // İptal embed'i oluştur
        const cancelEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('✅ İşlem İptal Edildi')
            .setDescription(`${targetUser} guard sisteminden silme işlemi iptal edildi.`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Kullanıcı', value: `${targetUser.tag}`, inline: true },
                { name: '🆔 ID', value: targetUser.id, inline: true },
                { name: '👮 İptal Eden', value: interaction.user.tag, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '✅ Durum', value: 'Kullanıcı guard sisteminde kaldı', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });
        
        await interaction.update({ 
            embeds: [cancelEmbed], 
            components: [] // Butonları tamamen kaldır
        });
        
        console.log(`\x1b[33m[PX-Guard]\x1b[0m Guard silme işlemi iptal edildi: ${targetUser.tag}`);
        
    } catch (error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Guard silme iptal hatası:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Hata')
            .setDescription('İşlem iptal edilirken bir hata oluştu!')
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        // Interaction zaten reply edilmişse followUp kullan
        try {
            await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
        } catch (followUpError) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m FollowUp hatası:', followUpError);
        }
    }
}

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