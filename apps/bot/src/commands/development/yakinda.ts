import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('yakında')
    .setDescription('Yakında satılacak ürünün bildirimini gönderir.')

export async function execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🚧 Yakında Geliyor!')
        .setDescription('Yeni özellikler üzerinde çalışıyoruz. Çok yakında sizinle olacak!')
        .setColor(0xffcc00)
        .setTimestamp()
        .setFooter({ text: 'PX-Guard | Pixel Development' });

    await interaction.reply({ embeds: [embed], ephemeral: false });
}