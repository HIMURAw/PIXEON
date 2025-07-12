const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { pool } = require('../DB/connect.js');
const Config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urunlistele')
        .setDescription('Ürün kategorilerindeki kanalları ve ortalama yıldız puanlarını listeler.')
        .addBooleanOption(option =>
            option.setName('sadece_puanli')
                .setDescription('Sadece puanı olan ürünleri göster')
                .setRequired(false)
        ),

    async execute(interaction) {
        const onlyRated = interaction.options.getBoolean('sadece_puanli') || false;
        const allowedCategoryIds = Config.discord.shopBot.productCategoryIds;

        try {
            // Ürün kategorilerindeki kanalları al
            const productChannels = interaction.guild.channels.cache
                .filter(channel =>
                    channel.type === ChannelType.GuildText &&
                    allowedCategoryIds.includes(channel.parentId)
                )
                .sort((a, b) => a.name.localeCompare(b.name));

            if (productChannels.size === 0) {
                return interaction.reply({
                    content: '❌ Ürün kategorilerinde hiç kanal bulunamadı.'
                });
            }

            // Veritabanından ortalama puanları al
            const channelIds = Array.from(productChannels.keys());
            const placeholders = channelIds.map(() => '?').join(',');

            let query = `
                SELECT 
                    product_channel_id,
                    product_channel_name,
                    AVG(rating) as avg_rating,
                    COUNT(*) as total_feedback
                FROM product_feedback 
                WHERE product_channel_id IN (${placeholders})
                GROUP BY product_channel_id, product_channel_name
            `;

            const [rows] = await pool.query(query, channelIds);
            const ratingsMap = new Map();

            rows.forEach(row => {
                ratingsMap.set(row.product_channel_id, {
                    avgRating: parseFloat(row.avg_rating).toFixed(1),
                    totalFeedback: row.total_feedback
                });
            });

            // Genel ortalama puanı hesapla
            let totalRating = 0;
            let totalFeedbacks = 0;

            rows.forEach(row => {
                totalRating += parseFloat(row.avg_rating) * row.total_feedback;
                totalFeedbacks += row.total_feedback;
            });

            const overallAverage = totalFeedbacks > 0 ? (totalRating / totalFeedbacks).toFixed(1) : 0;

            // Embed oluştur
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('📦 Ürün Listesi')
                .setDescription(`**${productChannels.size}** ürün bulundu\n⭐ **Genel Ortalama Puan:** ${overallAverage}/5`)
                .setFooter({ text: `${interaction.guild.name} | Ürün Kataloğu` })
                .setTimestamp();

            let productList = '';
            let ratedCount = 0;

            productChannels.forEach(channel => {
                const ratingData = ratingsMap.get(channel.id);

                if (onlyRated && !ratingData) {
                    return; // Sadece puanlı ürünler isteniyorsa, puanı olmayanları atla
                }

                if (ratingData) {
                    ratedCount++;
                    const stars = '⭐'.repeat(Math.round(parseFloat(ratingData.avgRating)));
                    productList += `**${channel.name}** ${stars} (${ratingData.avgRating}/5 - ${ratingData.totalFeedback} değerlendirme)\n`;
                } else {
                    productList += `**${channel.name}** ⭐⭐⭐⭐⭐ (Henüz değerlendirilmemiş)\n`;
                }
            });

            if (onlyRated && ratedCount === 0) {
                return interaction.reply({
                    content: '❌ Henüz değerlendirilmiş ürün bulunmuyor.'
                });
            }

            // Embed'e ürün listesini ekle
            if (productList.length > 4000) {
                // Liste çok uzunsa böl
                const chunks = productList.match(/.{1,4000}/g);
                chunks.forEach((chunk, index) => {
                    if (index === 0) {
                        embed.addFields({
                            name: `📋 Ürünler ${onlyRated ? '(Sadece Puanlı)' : ''}`,
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
                    name: `📋 Ürünler ${onlyRated ? '(Sadece Puanlı)' : ''}`,
                    value: productList
                });
            }

            // İstatistikler
            const totalRated = ratingsMap.size;
            const totalProducts = productChannels.size;

            embed.addFields({
                name: '📊 İstatistikler',
                value: `• Toplam Ürün: **${totalProducts}**\n• Değerlendirilen: **${totalRated}**\n• Değerlendirilmeyen: **${totalProducts - totalRated}**\n• Toplam Değerlendirme: **${totalFeedbacks}**`,
                inline: true
            });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Ürün listesi alınırken hata:', error);
            await interaction.reply({
                content: '❌ Ürün listesi alınırken bir hata oluştu.'
            });
        }
    }
};
