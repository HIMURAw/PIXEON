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
        .setName('yaz')
        .setDescription('Bot\'un kullandığı kanala dümdüz mesaj gönderir.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('sendPlainMessageModal')
            .setTitle('Mesaj Gönder');

        const messageInput = new TextInputBuilder()
            .setCustomId('plainMessageInput')
            .setLabel("Göndermek istediğiniz mesaj:")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder("Mesajınızı buraya yazın...");

        const actionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};
