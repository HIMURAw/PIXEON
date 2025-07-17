const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { pool } = require('../DB/connect.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urun-sil')
        .setDescription('Ürünler arasından seçip silmenizi sağlar.'),
    async execute(interaction) {
        // Ürünleri veritabanından çek
        let products = [];
        try {
            const [rows] = await pool.query('SELECT id, product_title FROM discord_products ORDER BY product_title ASC');
            products = rows;
        } catch (err) {
            console.error('Ürünler alınırken hata:', err);
            return interaction.reply({ content: '❌ Ürünler alınırken bir hata oluştu.', flags: 64 });
        }
        if (products.length === 0) {
            return interaction.reply({ content: '❌ Silinebilir ürün bulunamadı.', flags: 64 });
        }

        // Select menu için seçenekler hazırla
        const selectOptions = products.slice(0, 25).map(product => ({
            label: product.product_title,
            value: String(product.id)
        }));

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('🗑️ Silinebilir Ürünler')
            .setDescription('Aşağıdan silmek istediğiniz ürünü seçin ve "Sil" butonuna tıklayın.')
            .setTimestamp();

        // Select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('urunsil_urun_sec')
            .setPlaceholder('Bir ürün seçin...')
            .addOptions(selectOptions);

        // Sil butonu
        const deleteButton = new ButtonBuilder()
            .setCustomId('urunsil_sil')
            .setLabel('Sil')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑️');

        const row1 = new ActionRowBuilder().addComponents(selectMenu);
        const row2 = new ActionRowBuilder().addComponents(deleteButton);

        await interaction.reply({ embeds: [embed], components: [row1, row2], flags: 64 });
    },
};

// Interaction handler (server.js veya ana bot dosyanızda olmalı):
//
// if (interaction.isStringSelectMenu() && interaction.customId === 'urunsil_urun_sec') {
//     // Seçilen ürün ID'sini interaction.values[0] ile alın, bir yere kaydedin (ör. bir Map ile userId -> productId eşlemesi)
// }
// if (interaction.isButton() && interaction.customId === 'urunsil_sil') {
//     // Kullanıcının daha önce seçtiği ürün ID'sini alın ve DB'den silin
//     // Sonra kullanıcıya onay mesajı gönderin
// }
