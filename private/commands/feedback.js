const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { pool } = require('../DB/connect.js');
const Config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Bir ürün hakkında yıldızlı geri bildirim gönderir.')
        .addChannelOption(option =>
            option.setName('urun')
                .setDescription('Geri bildirim bırakmak istediğiniz ürün kanalı')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addIntegerOption(option =>
            option.setName('yildiz')
                .setDescription('Yıldız sayısı (1-5)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5)
        )
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Geri bildirim mesajınız')
                .setRequired(true)
        ),
    async execute(interaction) {
        const customerRoleId = Config.discord.shopBot.customerRoleId;
        const feedbackChannelId = Config.discord.shopBot.feedbackChannelId;
        const feedbackImageUrl = Config.discord.serverLogo;
        const allowedCategoryIds = Config.discord.shopBot.productCategoryIds;

        if (!interaction.member.roles.cache.has(customerRoleId)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için geçerli bir role sahip değilsiniz.', flags: 64 });
        }

        const productChannel = interaction.options.getChannel('urun');
        const rating = interaction.options.getInteger('yildiz');
        const feedbackMessage = interaction.options.getString('mesaj');

        // Kategori kontrolü
        if (!allowedCategoryIds.includes(productChannel.parentId)) {
            return interaction.reply({ content: 'Sadece belirlenen kategorilerdeki ürün kanallarına geri bildirim bırakabilirsiniz.', flags: 64 });
        }

        if (rating < 1 || rating > 5) {
            return interaction.reply({ content: 'Yıldız sayısı 1 ile 5 arasında olmalıdır.', flags: 64 });
        }

        await interaction.reply({ content: 'Geri bildiriminiz başarıyla alındı!', flags: 64 });

        // Veritabanına feedback kaydı
        try {
            const query = `
                INSERT INTO product_feedback 
                (user_id, username, product_channel_id, product_channel_name, rating, message) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            await pool.query(query, [
                interaction.user.id,
                interaction.user.username,
                productChannel.id,
                productChannel.name,
                rating,
                feedbackMessage
            ]);
        } catch (error) {
            console.error('Feedback veritabanına kaydedilirken hata:', error);
        }

        const starsStr = '⭐'.repeat(rating);
        const feedbackChannel = interaction.guild.channels.cache.get(feedbackChannelId);
        if (!feedbackChannel) return;

        const feedbackEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Feedback: ${productChannel.name}`)
            .setDescription(`**Ürün Seçimi:** ${productChannel.name}\n**Yıldız:** ${starsStr}\n**Mesaj:** ${feedbackMessage}`)
            .setFooter({ text: `Geri bildirim gönderen: ${interaction.user.tag}` })
            .setTimestamp();

        if (feedbackImageUrl) {
            feedbackEmbed.setImage(feedbackImageUrl);
        }

        await feedbackChannel.send({ embeds: [feedbackEmbed] });
    }
};