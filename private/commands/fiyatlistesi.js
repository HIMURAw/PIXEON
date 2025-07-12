const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pool } = require('../DB/connect.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fiyatlistesi')
        .setDescription('Veritabanındaki tüm ürünlerin fiyat listesini gösterir.')
        .addStringOption(option =>
            option.setName('siralama')
                .setDescription('Fiyat sıralama türü')
                .setRequired(false)
                .addChoices(
                    { name: 'Fiyat (Düşükten Yükseğe)', value: 'price_asc' },
                    { name: 'Fiyat (Yüksekten Düşüğe)', value: 'price_desc' },
                    { name: 'Eklenme Tarihi (Yeni)', value: 'date_desc' },
                    { name: 'Eklenme Tarihi (Eski)', value: 'date_asc' },
                    { name: 'İsim (A-Z)', value: 'name_asc' }
                )
        ),

    async execute(interaction) {
        const sortBy = interaction.options.getString('siralama') || 'name_asc';

        try {
            // Sıralama seçeneklerini belirle
            let orderBy = '';
            switch (sortBy) {
                case 'price_asc':
                    orderBy = 'price_tl ASC';
                    break;
                case 'price_desc':
                    orderBy = 'price_tl DESC';
                    break;
                case 'date_desc':
                    orderBy = 'added_at DESC';
                    break;
                case 'date_asc':
                    orderBy = 'added_at ASC';
                    break;
                case 'name_asc':
                default:
                    orderBy = 'product_title ASC';
                    break;
            }

            // Veritabanından ürünleri çek
            const query = `
                SELECT 
                    product_title,
                    channel_name,
                    price_tl,
                    price_usd,
                    price_eur,
                    added_at,
                    added_by
                FROM discord_products 
                ORDER BY ${orderBy}
            `;

            const [rows] = await pool.query(query);

            if (rows.length === 0) {
                return interaction.reply({ 
                    content: '❌ Veritabanında hiç ürün bulunamadı.', 
                    flags: 64 
                });
            }

            // İstatistikleri hesapla
            const totalProducts = rows.length;
            const totalValueTL = rows.reduce((sum, row) => sum + parseFloat(row.price_tl), 0);
            const avgPriceTL = (totalValueTL / totalProducts).toFixed(2);

            // Embed oluştur
            const embed = new EmbedBuilder()
                .setColor('#ff6b35')
                .setTitle('💰 Fiyat Listesi')
                .setDescription(`**${totalProducts}** ürün bulundu\n📊 **Ortalama Fiyat:** ${avgPriceTL}₺`)
                .setFooter({ text: `${interaction.guild.name} | Ürün Fiyat Kataloğu` })
                .setTimestamp();

            // Ürün listesini oluştur
            let productList = '';
            let totalValueUSD = 0;
            let totalValueEUR = 0;

            rows.forEach((row, index) => {
                const addedDate = new Date(row.added_at).toLocaleDateString('tr-TR');
                totalValueUSD += parseFloat(row.price_usd);
                totalValueEUR += parseFloat(row.price_eur);

                productList += `**${index + 1}.** **${row.product_title}**\n`;
                productList += `   📍 ${row.channel_name}\n`;
                productList += `   💰 **${row.price_tl}₺** | **${row.price_usd}$** | **${row.price_eur}€**\n`;
                productList += `   📅 ${addedDate}\n\n`;
            });

            // Embed'e ürün listesini ekle
            if (productList.length > 4000) {
                // Liste çok uzunsa böl
                const chunks = productList.match(/.{1,4000}/g);
                chunks.forEach((chunk, index) => {
                    if (index === 0) {
                        embed.addFields({ 
                            name: `📋 Ürünler (${sortBy.replace('_', ' ').toUpperCase()})`, 
                            value: chunk 
                        });
                    } else {
                        embed.addFields({ 
                            name: `📋 Ürünler (Devam)`, 
                            value: chunk 
                        });
                    }
                });
            } else {
                embed.addFields({ 
                    name: `📋 Ürünler (${sortBy.replace('_', ' ').toUpperCase()})`, 
                    value: productList 
                });
            }

            // Toplam değer istatistikleri
            const avgPriceUSD = (totalValueUSD / totalProducts).toFixed(2);
            const avgPriceEUR = (totalValueEUR / totalProducts).toFixed(2);

            embed.addFields({
                name: '📊 Toplam Değer',
                value: `• **TL:** ${totalValueTL.toFixed(2)}₺\n• **USD:** ${totalValueUSD.toFixed(2)}$\n• **EUR:** ${totalValueEUR.toFixed(2)}€`,
                inline: true
            });

            embed.addFields({
                name: '📈 Ortalama Fiyatlar',
                value: `• **TL:** ${avgPriceTL}₺\n• **USD:** ${avgPriceUSD}$\n• **EUR:** ${avgPriceEUR}€`,
                inline: true
            });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Fiyat listesi alınırken hata:', error);
            await interaction.reply({ 
                content: '❌ Fiyat listesi alınırken bir hata oluştu.', 
                flags: 64 
            });
        }
    }
};
