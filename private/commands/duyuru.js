const {
    PermissionsBitField,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    SlashCommandBuilder,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duyuru')
        .setDescription('Belirttiğiniz mesajı seçtiğiniz kanala duyuru olarak gönderir.')
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Mesajın gönderileceği kanal')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),

    async execute(interaction) {
        const channel = interaction.options.getChannel('kanal');

        const modal = new ModalBuilder()
            .setCustomId(`sendMessageModal-${channel.id}`)
            .setTitle('Mesaj Gönder');

        const messageInput = new TextInputBuilder()
            .setCustomId('messageInput')
            .setLabel("Göndermek istediğiniz mesaj:")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder("Duyuru mesajınızı buraya yazın...");

        const actionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};
