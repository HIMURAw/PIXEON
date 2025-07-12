const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { pool } = require('../DB/connect.js');
const Config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urunekle')
        .setDescription('Bir ürünü seçilen kanala embed olarak ekler.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Ürünün gönderileceği kanal')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(option =>
            option.setName('foto')
                .setDescription('Ürün fotoğrafının URL adresi')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('fiyat')
                .setDescription('Ürün fiyatı (TL)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('bilgi')
                .setDescription('Ürün başlığı veya kısa açıklaması')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('detaylar')
                .setDescription('Ekstra detaylar (isteğe bağlı)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const channel = interaction.options.getChannel('kanal');
        const photo = interaction.options.getString('foto');
        const priceString = interaction.options.getString('fiyat');
        const info = interaction.options.getString('bilgi');
        const customDetails = interaction.options.getString('detaylar');

        if (!photo) {
            return interaction.reply({ content: 'Geçersiz fotoğraf URL\'si. Lütfen geçerli bir URL girin.', flags: 64 });
        }

        const priceTL = parseFloat(priceString.replace(',', '.'));
        if (isNaN(priceTL) || priceTL <= 0) {
            return interaction.reply({ content: 'Geçersiz fiyat. Lütfen pozitif bir sayı girin.', flags: 64 });
        }

        // Doğru oranlarla fiyat dönüşümü
        const priceUSD = (priceTL / Config.discord.shopBot.dolar).toFixed(2);
        const priceEUR = (priceTL / Config.discord.shopBot.euro).toFixed(2);

        const embed = new EmbedBuilder()
            .setTitle(`**${info.toUpperCase()}**`)
            .setColor('#0099ff')
            .setDescription(`**Detaylar:** ${customDetails || 'Detay verilmedi.'}`)
            .addFields({ name: '**Fiyatlar 💰**', value: `\`TL: ${priceTL}₺\`\n\`Dolar: ${priceUSD}$\`\n\`Euro: ${priceEUR}€\``, inline: true })
            .setFooter({ text: 'Ticket açarak daha fazla bilgi alabilirsiniz.' })
            .setTimestamp()
            .setImage(photo);

        try {
            // Veritabanına ürün kaydı
            const insertQuery = `
                INSERT INTO discord_products 
                (channel_id, channel_name, product_title, price_tl, price_usd, price_eur, photo_url, details, added_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                channel_name = VALUES(channel_name),
                product_title = VALUES(product_title),
                price_tl = VALUES(price_tl),
                price_usd = VALUES(price_usd),
                price_eur = VALUES(price_eur),
                photo_url = VALUES(photo_url),
                details = VALUES(details),
                added_by = VALUES(added_by),
                added_at = CURRENT_TIMESTAMP
            `;
            
            await pool.query(insertQuery, [
                channel.id,
                channel.name,
                info,
                priceTL,
                priceUSD,
                priceEUR,
                photo,
                customDetails || null,
                interaction.user.id
            ]);

            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: '✅ Ürün başarıyla gönderildi ve veritabanına kaydedildi!', flags: 64 });
        } catch (err) {
            console.error('Ürün ekleme hatası:', err);
            await interaction.reply({ content: '❌ Ürün eklenirken bir hata oluştu. Lütfen botun izinlerini kontrol et.', flags: 64 });
        }
    }
};