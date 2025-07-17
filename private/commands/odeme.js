const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('odeme')
        .setDescription('Ödeme yollarını gösterir (Papara ve IBAN)'),
    async execute(interaction) {
        const papara = Config.discord.shopBot.papara;
        const iban = Config.discord.shopBot.iban;
        const ibanName = Config.discord.shopBot.ibanName;

        if (!papara && !iban) {
            return interaction.reply({ content: 'Ödeme bilgileri ayarlanmamış.', flags: 64 });
        }

        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('💸 Ödeme Yöntemleri')
            .setDescription('Aşağıdaki yöntemlerle ödeme yapabilirsiniz:')
            .addFields(
                papara ? { name: 'Papara', value: `\`${papara}\`` } : null,
                iban ? { name: 'IBAN', value: `\`${iban}\`\nİsim Soyisim: **${ibanName || '-'}**` } : null
            )
            .setFooter({ text: Config.discord.serverName })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
