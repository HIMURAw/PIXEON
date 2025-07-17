const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { pool } = require('../DB/connect.js');
const Config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('satinal')
        .setDescription('Satın almak istediğiniz ürünü seçin.'),
    async execute(interaction) {
        // Veritabanından ürünleri çek
        let products = [];
        try {
            const [rows] = await pool.query('SELECT id, product_title, price_tl, price_usd, price_eur, details FROM discord_products ORDER BY product_title ASC');
            products = rows;
        } catch (err) {
            console.error('Ürünler alınırken hata:', err);
            return interaction.reply({ content: '❌ Ürünler alınırken bir hata oluştu.', flags: 64 });
        }
        if (products.length === 0) {
            return interaction.reply({ content: '❌ Satın alınabilir ürün bulunamadı.', flags: 64 });
        }

        // Select menu için seçenekler hazırla (Discord limiti: 25)
        const selectOptions = products.slice(0, 25).map(product => ({
            label: product.product_title,
            description: `TL: ${product.price_tl}₺ | USD: ${product.price_usd}$ | EUR: ${product.price_eur}€`,
            value: String(product.id)
        }));

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setColor('#00b894')
            .setTitle('🛒 Satın Alınabilir Ürünler')
            .setDescription('Aşağıdan satın almak istediğiniz ürünü seçin ve "Satın Al" butonuna tıklayın.')
            .setFooter({ text: Config.discord.serverName || 'PXDevelopment' })
            .setTimestamp();

        // Select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('satinal_urun_sec')
            .setPlaceholder('Bir ürün seçin...')
            .addOptions(selectOptions);

        // Satın Al butonu
        const buyButton = new ButtonBuilder()
            .setCustomId('satinal_satin_al')
            .setLabel('Satın Al')
            .setStyle(ButtonStyle.Success)
            .setEmoji('💸');

        const row1 = new ActionRowBuilder().addComponents(selectMenu);
        const row2 = new ActionRowBuilder().addComponents(buyButton);

        await interaction.reply({ embeds: [embed], components: [row1, row2], flags: 64 });
    }
};
