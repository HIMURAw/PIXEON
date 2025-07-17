const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sil')
    .setDescription('Belirtilen sayı kadar mesajı siler.')
    .addIntegerOption(option =>
      option.setName('sayi')
        .setDescription('Silinecek mesaj sayısı (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    // Yalnızca yetkili kullanıcılar kullanabilsin
    if (!interaction.member.permissions.has('ManageMessages')) {
      return await interaction.reply({ content: 'Bu komutu kullanmak için Mesajları Yönet yetkisine sahip olmalısın.', ephemeral: true });
    }
    const sayi = interaction.options.getInteger('sayi');
    if (!sayi || sayi < 1 || sayi > 100) {
      return await interaction.reply({ content: 'Lütfen 1 ile 100 arasında bir sayı girin.', ephemeral: true });
    }
    try {
      const deleted = await interaction.channel.bulkDelete(sayi, true);
      await interaction.reply({ content: `${deleted.size} mesaj başarıyla silindi.`, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: 'Mesajlar silinirken bir hata oluştu. (14 günden eski mesajlar silinemez)', ephemeral: true });
    }
  }
};
