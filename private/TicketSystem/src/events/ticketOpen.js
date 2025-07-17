const {
    Events,
    PermissionsBitField,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
} = require("discord.js");
const Config = require("../../../../config.js");
const ticketChannels = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "ticket-olustur"
        ) {
            const selectedValue = interaction.values[0];

            const himurainmenusu = new StringSelectMenuBuilder()
                .setCustomId("ticket-actions")
                .setPlaceholder("Ticketi yönetmek için kategori seçiniz.")
                .addOptions([
                    {
                        label: "Kayıt et ve kapat.",
                        description: "Ticketi kaydeder ve kapatır.",
                        value: "kaydetkapat",
                    },
                    {
                        label: "Sorunumu ben çözdüm.",
                        description: "Sorununuzu kendiniz çözdüyseniz seçin.",
                        value: "bencozdum",
                    },
                ]);

            const actionRowMenu = new ActionRowBuilder().addComponents(
                himurainmenusu
            );

            // Ticket açma işlemleri
            let channelName, ticketType, embedTitle, embedDesc;
            switch (selectedValue) {
                case "satinalim":
                    channelName = `${interaction.user.username}-satinalim`;
                    ticketType = "Satın Alım";
                    embedTitle = `💸 [Satın Alım] | ${interaction.user.username}`;
                    embedDesc = "Satın alım işlemlerinizle ilgili destek için buradasınız.";
                    break;
                case "destek":
                    channelName = `${interaction.user.username}-destek`;
                    ticketType = "Destek";
                    embedTitle = `🛠️ [Destek] | ${interaction.user.username}`;
                    embedDesc = "Genel destek talepleriniz için buradasınız.";
                    break;
                case "partnerlik":
                    channelName = `${interaction.user.username}-partnerlik`;
                    ticketType = "Partnerlik";
                    embedTitle = `🤝 [Partnerlik] | ${interaction.user.username}`;
                    embedDesc = "Partnerlik başvurularınız için buradasınız.";
                    break;
                case "diğer":
                    channelName = `${interaction.user.username}-diger`;
                    ticketType = "Diğer";
                    embedTitle = `❓ [Diğer] | ${interaction.user.username}`;
                    embedDesc = "Diğer tüm konular için buradasınız.";
                    break;
                case "sifirla":
                    await interaction.reply({
                        content: `<@${interaction.user.id}> Başarılı bir şekilde seçenek sıfırlandı.`,
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                default:
                    await interaction.reply({
                        content: "Geçersiz seçenek!",
                        flags: MessageFlags.Ephemeral
                    });
                    return;
            }

            await interaction.reply({
                content: `<@${interaction.user.id}> Ticket'in açılıyor...`,
                flags: MessageFlags.Ephemeral
            });

            // Kategori ID'si configte yoksa, sabit string kullan
            const ticketCategory = Config.discord.ticketBot.catagory || 'TICKET_CATEGORY_ID';

            const ticketChannel = await interaction.guild.channels.create({
                type: ChannelType.GuildText,
                parent: ticketCategory,
                name: channelName,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: Config.discord.supportRoleId,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            ticketChannels.set(interaction.user.id, ticketChannel.id);

            const embed = new EmbedBuilder()
                .setColor("#000000")
                .setTitle(embedTitle)
                .setDescription(embedDesc);

            await ticketChannel.send({
                content: `<@${interaction.user.id}> - <@&${Config.discord.supportRoleId}>`,
                embeds: [embed],
                components: [actionRowMenu],
            });
            // Satın alım ticketi ise bilgi mesajı gönder
            if (selectedValue === "satinalim") {
                await ticketChannel.send({
                    content: '💡 **Satın alma işlemleri için**\n`/satinal` komutunu kullanarak ürünleri görebilir ve satın alabilirsiniz.'
                });
            }
            // Partnerlik ticketi ise bilgi mesajı gönder
            if (selectedValue === "partnerlik") {
                await ticketChannel.send({
                    content: '🤝 **Partnerlik başvurusu için**\n`/partner` komutunu kullanarak başvurunuzu oluşturabilirsiniz.'
                });
            }
        } else if (
            interaction.isModalSubmit() &&
            interaction.customId === "digerModal"
        ) {
            const acikcasorun = interaction.fields.getTextInputValue("acikcasorun");
            const ticketId = ticketChannels.get(interaction.user.id);
            const ticketChannel = interaction.guild.channels.cache.get(ticketId);
            if (ticketChannel) {
                const embed = new EmbedBuilder()
                    .setColor("#000000")
                    .setTitle(`${interaction.user.username}`)
                    .setDescription(`${acikcasorun}`);
                await interaction.reply({
                    content: `${acikcasorun}`,
                    flags: MessageFlags.Ephemeral
                });
                const himurainmenusu = new StringSelectMenuBuilder()
                    .setCustomId("ticket-actions")
                    .setPlaceholder("Ticketi yönetmek için kategori seçiniz.")
                    .addOptions([
                        {
                            label: "Kayıt et ve kapat.",
                            description: "Ticketi kaydeder ve kapatır.",
                            value: "kaydetkapat",
                        },
                        {
                            label: "Sorunumu ben çözdüm.",
                            description: "Sorununuzu kendiniz çözdüyseniz seçin.",
                            value: "bencozdum",
                        },
                    ]);
                const actionRowMenu = new ActionRowBuilder().addComponents(himurainmenusu);
                await ticketChannel.send({
                    content: `<@${interaction.user.id}> - <@&${Config.discord.supportRoleId}>`,
                    embeds: [embed],
                    components: [actionRowMenu],
                });
            }
        }
    },
};
