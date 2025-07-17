const { EmbedBuilder } = require('discord.js');
const Config = require('../../../config.js');

// Node.js 18+ için fetch kullan, değilse node-fetch yükle
let fetch;
if (typeof globalThis.fetch === 'undefined') {
    fetch = require('node-fetch');
} else {
    fetch = globalThis.fetch;
}

/**
 * Guard sistemi webhook logger
 */
class GuardWebhookLogger {
    constructor() {
        this.webhookUrl = Config.discord.log.GuardLog;
        this.webhookName = Config.discord.log.WebhookName;
        this.webhookLogo = Config.discord.log.WebhookLogoURL;
    }

    /**
     * Webhook'a embed gönder
     * @param {EmbedBuilder} embed - Gönderilecek embed
     */
    async sendWebhook(embed) {
        try {
            if (!this.webhookUrl) {
                console.warn('\x1b[33m[PX-Guard]\x1b[0m Guard webhook URL bulunamadı!');
                return;
            }

            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.webhookName,
                    avatar_url: this.webhookLogo,
                    embeds: [embed.toJSON()]
                })
            });
        } catch (error) {
            console.error('\x1b[31m[PX-Guard]\x1b[0m Webhook gönderme hatası:', error);
        }
    }

    /**
     * Kullanıcı ekleme logu
     * @param {Object} data - Kullanıcı verileri
     */
    async logUserAdd(data) {
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('🛡️ Guard Kullanıcısı Eklendi')
            .setDescription(`${data.targetUser} guard sistemine eklendi!`)
            .setThumbnail(data.targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Kullanıcı', value: `${data.targetUser.tag}`, inline: true },
                { name: '🆔 ID', value: data.targetUser.id, inline: true },
                { name: '🛡️ Seviye', value: data.levelInfo.name, inline: true },
                { name: '👮 Ekleyen', value: data.moderator.tag, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '✅ Durum', value: 'Aktif', inline: true },
                { name: '🔐 Yetkiler', value: data.levelInfo.permissions.map(perm => `• ${perm}`).join('\n'), inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await this.sendWebhook(embed);
    }

    /**
     * Kullanıcı güncelleme logu
     * @param {Object} data - Güncelleme verileri
     */
    async logUserUpdate(data) {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🔄 Guard Kullanıcısı Güncellendi')
            .setDescription(`${data.targetUser} güncellendi!`)
            .setThumbnail(data.targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Kullanıcı', value: `${data.targetUser.tag}`, inline: true },
                { name: '🆔 ID', value: data.targetUser.id, inline: true },
                { name: '👮 Güncelleyen', value: data.moderator.tag, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '🔄 İşlem', value: data.operationName, inline: true },
                { name: '📝 Sebep', value: data.reason, inline: true },
                { name: '📊 Değişiklik', value: `${data.oldValue} → ${data.newValue}`, inline: false },
                { name: '📋 Güncel Bilgiler', value: data.currentInfo, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await this.sendWebhook(embed);
    }

    /**
     * Kullanıcı silme logu
     * @param {Object} data - Silme verileri
     */
    async logUserRemove(data) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('🗑️ Guard Kullanıcısı Silindi')
            .setDescription(`${data.targetUser} guard sisteminden silindi!`)
            .setThumbnail(data.targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Kullanıcı', value: `${data.targetUser.tag}`, inline: true },
                { name: '🆔 ID', value: data.targetUser.id, inline: true },
                { name: '👮 Silen', value: data.moderator.tag, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '🛡️ Eski Seviye', value: data.oldLevel, inline: true },
                { name: '📊 Eski Durum', value: data.oldStatus, inline: true },
                { name: '📝 Sebep', value: data.reason, inline: false },
                { name: '⚠️ Not', value: 'Kullanıcı tüm guard yetkilerini kaybetti.', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await this.sendWebhook(embed);
    }

    /**
     * Kullanıcı listeleme logu
     * @param {Object} data - Liste verileri
     */
    async logUserList(data) {
        const embed = new EmbedBuilder()
            .setColor(0xffa500)
            .setTitle('📋 Guard Kullanıcı Listesi Görüntülendi')
            .setDescription(`Guard kullanıcı listesi görüntülendi.`)
            .addFields(
                { name: '👤 Görüntüleyen', value: data.viewer.tag, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '📊 Toplam Kullanıcı', value: data.totalUsers.toString(), inline: true },
                { name: '🔍 Filtreler', value: data.filters || 'Filtre yok', inline: true },
                { name: '📈 İstatistikler', value: data.stats, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await this.sendWebhook(embed);
    }

    /**
     * Hata logu
     * @param {Object} data - Hata verileri
     */
    async logError(data) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Guard Sistemi Hatası')
            .setDescription('Guard sisteminde bir hata oluştu!')
            .addFields(
                { name: '👤 Kullanıcı', value: data.user?.tag || 'Bilinmeyen', inline: true },
                { name: '🆔 ID', value: data.user?.id || 'Bilinmeyen', inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '🔧 İşlem', value: data.operation || 'Bilinmeyen', inline: true },
                { name: '❌ Hata', value: data.error.message || 'Bilinmeyen hata', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await this.sendWebhook(embed);
    }

    /**
     * Sistem başlatma logu
     * @param {Object} data - Başlatma verileri
     */
    async logSystemStart(data) {
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('🚀 Guard Sistemi Başlatıldı')
            .setDescription('Guard sistemi başarıyla başlatıldı!')
            .addFields(
                { name: '🤖 Bot', value: data.botName, inline: true },
                { name: '🆔 Bot ID', value: data.botId, inline: true },
                { name: '📅 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                { name: '⚙️ Durum', value: 'Aktif', inline: true },
                { name: '📊 Sunucu Sayısı', value: data.guildCount.toString(), inline: true },
                { name: '👥 Kullanıcı Sayısı', value: data.userCount.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'PX Development Guard Bot' });

        await this.sendWebhook(embed);
    }
}

module.exports = new GuardWebhookLogger(); 