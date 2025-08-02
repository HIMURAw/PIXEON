import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    GuildMember,
    ComponentType,
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('çekiliş')
    .setDescription('Butonlu çekiliş başlatır.')
    .addIntegerOption(option =>
        option.setName('kazanan_sayisi')
            .setDescription('Kaç kazanan olacak?')
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('sure')
            .setDescription('Çekiliş süresi (saniye)')
            .setMinValue(10)
            .setMaxValue(86400)
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('odul')
            .setDescription('Ödül açıklaması')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const kazananSayisi = interaction.options.getInteger('kazanan_sayisi', true);
    const sure = interaction.options.getInteger('sure', true);
    const odul = interaction.options.getString('odul', true);

    const katilanlar = new Set<string>();

    const katilButton = new ButtonBuilder()
        .setCustomId('katil')
        .setLabel('🎉 Katıl')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(katilButton);

    const embed = new EmbedBuilder()
        .setTitle('🎁 Yeni Çekiliş!')
        .setDescription(`🎉 **${odul}** ödüllü çekiliş başladı!\n\n⏳ Süre: **${sure} saniye**\n🏆 Kazanan: **${kazananSayisi} kişi**\n👥 Katılımcı: **0**`)
        .setColor(0x3498db)
        .setFooter({ text: `Başlatan: ${interaction.user.tag}` })
        .setTimestamp();

    const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: sure * 1000,
    });

    collector.on('collect', async i => {
        if (katilanlar.has(i.user.id)) {
            await i.reply({ content: 'Zaten çekilişe katıldın!', ephemeral: true });
            return;
        }

        katilanlar.add(i.user.id);

        const guncelEmbed = EmbedBuilder.from(embed)
            .setDescription(`🎉 **${odul}** ödüllü çekiliş başladı!\n\n⏳ Süre: **${sure} saniye**\n🏆 Kazanan: **${kazananSayisi} kişi**\n👥 Katılımcı: **${katilanlar.size}**`);

        await i.update({ embeds: [guncelEmbed], components: [row] });
    });

    collector.on('end', async () => {
        row.components[0].setDisabled(true);

        if (katilanlar.size === 0) {
            const finalEmbed = EmbedBuilder.from(embed)
                .setDescription(`❌ Çekilişe kimse katılmadı. İptal edildi.`)
                .setColor(0xe74c3c);

            return interaction.editReply({ embeds: [finalEmbed], components: [row] });
        }

        const kazananlar = Array.from(katilanlar)
            .sort(() => 0.5 - Math.random())
            .slice(0, kazananSayisi);

        const kazananListesi = kazananlar.map((id, i) => `**${i + 1}.** <@${id}>`).join('\n');

        const finalEmbed = new EmbedBuilder()
            .setTitle('🎉 Çekiliş Sonuçları')
            .setDescription(`**Ödül:** ${odul}\n\n🏆 **Kazananlar:**\n${kazananListesi}`)
            .setColor(0x2ecc71)
            .setTimestamp();

        await interaction.editReply({ embeds: [finalEmbed], components: [row] });
    });
}
