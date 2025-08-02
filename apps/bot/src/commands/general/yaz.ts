import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalSubmitInteraction,
    Interaction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('yaz')
    .setDescription('Modal açar ve yazdığın metni kanala gönderir.');

export async function execute(interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
        .setCustomId('yaz_modal')
        .setTitle('📝 Bir şeyler yaz');

    const yazInput = new TextInputBuilder()
        .setCustomId('mesaj_input')
        .setLabel('Gönderilecek Mesaj')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder('Ne söylemek istersin?');

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(yazInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
}
