const {
    Events,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    MessageFlags,
} = require("discord.js");
const Config = require("../../../../config.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "ticket-actions"
        ) {
            const selectedValue = interaction.values[0];

            switch (selectedValue) {
                case "kaydetkapat":
                    await interaction.reply({
                        content: `<@${interaction.user.id}> Ticket kapanıyor...`,
                    });

                    await interaction.channel.permissionOverwrites.set([
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: Config.discord.supportRoleId,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ]);

                    const pixelinbutonu = new ButtonBuilder()
                        .setCustomId("ticketisil")
                        .setLabel("Ticketi Sil")
                        .setStyle(ButtonStyle.Danger);

                    const himurainactionu =
                        new ActionRowBuilder().addComponents(pixelinbutonu);

                    await interaction.channel.send({
                        content: `<@${interaction.user.id}> Ticket silinsin mi?`,
                        components: [himurainactionu],
                    });

                    break;

                case "bencozdum":
                    await interaction.reply({
                        content: `<@${interaction.user.id}> Ticket kapanıyor...`,
                    });

                    await interaction.channel.permissionOverwrites.set([
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: Config.discord.supportRoleId,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ]);

                    const pixelinbutonuu = new ButtonBuilder()
                        .setCustomId("ticketisil")
                        .setLabel("Ticketi Sil")
                        .setStyle(ButtonStyle.Danger);

                    const himurainactionuu =
                        new ActionRowBuilder().addComponents(pixelinbutonuu);

                    await interaction.channel.send({
                        content: `<@${interaction.user.id}> Ticket silinsin mi?`,
                        components: [himurainactionuu],
                    });
                    break;

                default:
                    await interaction.reply({
                        content: "Geçersiz seçenek!",
                        flags: MessageFlags.Ephemeral
                    });
                    break;
            }
        }
    },
};
