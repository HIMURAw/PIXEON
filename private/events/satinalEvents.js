const Config = require('../../config.js');
const { pool } = require('../DB/connect');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const satinalSecimMap = new Map();

async function handleSatinalSelect(interaction) {
    satinalSecimMap.set(interaction.user.id, interaction.values[0]);
    await interaction.reply({ content: 'Satın almak istediğiniz ürünü seçtiniz. Şimdi "Satın Al" butonuna tıklayın.', flags: 64 });
}

async function handleSatinalButton(interaction) {
    const selectedProductId = satinalSecimMap.get(interaction.user.id);
    if (!selectedProductId) {
        await interaction.reply({ content: 'Lütfen önce bir ürün seçin.', flags: 64 });
        return;
    }
    try {
        const [rows] = await pool.query('SELECT * FROM discord_products WHERE id = ?', [selectedProductId]);
        const product = rows[0];
        if (!product) {
            await interaction.reply({ content: 'Seçilen ürün bulunamadı.', flags: 64 });
            return;
        }
        await interaction.reply({
            embeds: [
                {
                    color: 0x00b894,
                    title: `💸 Satın Alma Bilgisi: ${product.product_title}`,
                    description: `Fiyat: ${product.price_tl}₺ | ${product.price_usd}$ | ${product.price_eur}€\nDetaylar: ${product.details || 'Yok'}\n\nÖdeme için lütfen aşağıdaki bilgileri kullanın.\nPapara: ${Config.discord.shopBot.papara || '-'}\nIBAN: ${Config.discord.shopBot.iban || '-'}\nİsim Soyisim: **${Config.discord.shopBot.ibanName || '-'}**`,
                    timestamp: new Date()
                }
            ],
            flags: 64
        });
        const logChannelId = Config.discord.shopBot.seelLogChannel;
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            const adminEmbed = {
                color: 0xfdcb6e,
                title: '🛒 Yeni Satın Alma Talebi',
                description: `Kullanıcı: <@${interaction.user.id}> (${interaction.user.tag})\nÜrün: **${product.product_title}**\nFiyat: ${product.price_tl}₺ | ${product.price_usd}$ | ${product.price_eur}€`,
                footer: { text: 'Onay veya Reddet butonunu kullanın.' },
                timestamp: new Date()
            };
            const approveBtn = new ButtonBuilder()
                .setCustomId(`satinal_onayla_${interaction.user.id}_${product.id}`)
                .setLabel('Onayla')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅');
            const declineBtn = new ButtonBuilder()
                .setCustomId(`satinal_reddet_${interaction.user.id}_${product.id}`)
                .setLabel('Reddet')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌');
            const row = new ActionRowBuilder().addComponents(approveBtn, declineBtn);
            await logChannel.send({ embeds: [adminEmbed], components: [row] });
        }
        const papara = Config.discord.shopBot.papara || '';
        const iban = Config.discord.shopBot.iban || '';
        const paymentInfo = `Papara: ${papara} | IBAN: ${iban} | İsim Soyisim: ${Config.discord.shopBot.ibanName || '-'}`;
        try {
            await pool.query(
                'INSERT INTO discord_purchase_requests (user_id, product_id, product_title, product_price, payment_info, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [interaction.user.id, product.id, product.product_title, product.price_tl, paymentInfo, 'pending']
            );
        } catch (err) {
            console.error('Satın alma talebi DB kaydı hatası:', err);
        }
        satinalSecimMap.delete(interaction.user.id);
    } catch (err) {
        console.error('Satın alma işlemi sırasında hata:', err);
        await interaction.reply({ content: 'Satın alma işlemi sırasında bir hata oluştu.', flags: 64 });
    }
}

async function handleSatinalAdmin(interaction) {
    const [, action, userId, productId] = interaction.customId.split('_');
    let request;
    try {
        const [rows] = await pool.query('SELECT * FROM discord_purchase_requests WHERE user_id = ? AND product_id = ? AND status = "pending" ORDER BY created_at DESC LIMIT 1', [userId, productId]);
        request = rows[0];
    } catch (err) {
        return interaction.reply({ content: '❌ Talep bulunamadı.', flags: 64 });
    }
    if (!request) {
        return interaction.reply({ content: '❌ Talep bulunamadı veya zaten işlenmiş.', flags: 64 });
    }
    let newStatus = action === 'onayla' ? 'approved' : 'declined';
    try {
        await pool.query('UPDATE discord_purchase_requests SET status = ?, admin_id = ?, admin_username = ?, updated_at = NOW() WHERE id = ?', [newStatus, interaction.user.id, interaction.user.tag, request.id]);
    } catch (err) {
        return interaction.reply({ content: '❌ DB güncellenemedi.', flags: 64 });
    }
    try {
        const user = await interaction.guild.members.fetch(userId);
        if (user) {
            if (newStatus === 'approved') {
                await user.send(`🎉 Satın alma talebin onaylandı! Ürün: **${request.product_title}**`);
                try {
                    await pool.query(
                        `INSERT INTO discord_users (discord_id, username, roles) VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE username=VALUES(username), roles=VALUES(roles)`,
                        [userId, user.user.tag, JSON.stringify([])]
                    );
                } catch (userErr) {
                    console.error('Kullanıcıya ürün eklenirken hata:', userErr);
                }
            } else {
                await user.send(`❌ Satın alma talebin reddedildi. Ürün: **${request.product_title}**`);
            }
        }
    } catch (err) {}
    await interaction.reply({ content: `Talep ${newStatus === 'approved' ? 'onaylandı' : 'reddedildi'}.`, flags: 64 });
}

module.exports = {
    handleSatinalSelect,
    handleSatinalButton,
    handleSatinalAdmin
}; 