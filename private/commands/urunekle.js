const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
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
            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: '✅ Ürün başarıyla gönderildi!', flags: 64 });
        } catch (err) {
            console.error('Mesaj gönderme hatası:', err);
            await interaction.reply({ content: '❌ Embed mesajı gönderilemedi. Lütfen botun izinlerini kontrol et.', flags: 64 });
        }
    }
};