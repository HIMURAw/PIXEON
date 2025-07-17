const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const Config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yakinda')
        .setDescription('Yakında satışa çıkacak ürün için embed duyurusu gönderir.'),
    async execute(interaction) {
        const channel = interaction.options.getChannel('kanal');
        await interaction.deferReply({ flags: 64 });

        const embed = new EmbedBuilder()
            .setColor('#8e44ad')
            .setTitle('🚀 YAKINDA SATIŞTA!')
            .setDescription(Config.discord.shopBot.near)
            .setFooter({ text: Config.discord.serverName + ' | Yakında Satışta' })
            .setTimestamp();

        try {
            await channel.send({ embeds: [embed] });
            await interaction.editReply({ content: '✅ Duyuru başarıyla gönderildi!' });
        } catch (err) {
            console.error('Mesaj gönderme hatası:', err);
            await interaction.editReply({ content: '❌ Embed mesajı gönderilemedi. Lütfen botun izinlerini kontrol et.' });
        }
    },
};
