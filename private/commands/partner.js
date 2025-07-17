const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Config = require('../../config.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('partner')
            .setDescription('Sunucunuz için partner başvurusu yapın.'),
        async execute(interaction) {
            // Modal oluştur
            const modal = new ModalBuilder()
                .setCustomId('partnerBasvuruModal')
                .setTitle('Partner Başvurusu');

            const nameInput = new TextInputBuilder()
                .setCustomId('partner_server_name')
                .setLabel('Sunucu İsmi')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const inviteInput = new TextInputBuilder()
                .setCustomId('partner_invite')
                .setLabel('Sunucu Davet Linki')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const descInput = new TextInputBuilder()
                .setCustomId('partner_desc')
                .setLabel('Sunucu Tanıtım Yazısı')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(nameInput),
                new ActionRowBuilder().addComponents(inviteInput),
                new ActionRowBuilder().addComponents(descInput)
            );

            await interaction.showModal(modal);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('partnerler')
            .setDescription('Mevcut partnerleri listeler ve partnerliği bitirmenizi sağlar.')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
        async execute(interaction) {
            // Partnerlik kategorisindeki kanalları bul
            const partnerCategoryId = Config.discord.partnerBot.categoryId;
            const partnerChannels = interaction.guild.channels.cache.filter(
                c => c.parentId === partnerCategoryId && c.type === ChannelType.GuildText
            );
            if (!partnerChannels.size) {
                return interaction.reply({ content: 'Hiç partner kanalı bulunamadı.', flags: 64 });
            }
            // Select menu için seçenekler hazırla
            const selectOptions = partnerChannels.map(channel => ({
                label: channel.name,
                value: channel.id
            }));
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('partner_sil_sec')
                .setPlaceholder('Bir partner kanalı seçin...')
                .addOptions(selectOptions);
            const silButton = new ButtonBuilder()
                .setCustomId('partner_sil_buton')
                .setLabel('Partnerliği Bitir')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🗑️');
            const row1 = new ActionRowBuilder().addComponents(selectMenu);
            const row2 = new ActionRowBuilder().addComponents(silButton);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#e17055')
                        .setTitle('🤝 Partner Listesi')
                        .setDescription('Partnerliği bitirmek istediğiniz kanalı seçin ve butona tıklayın.')
                ],
                components: [row1, row2],
                flags: 64
            });
        }
    }
];
