const {
    SlashCommandBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    MessageFlags,
} = require("discord.js");
const Config = require('../../../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-olustur")
        .setDescription(
            "Kullanıcıların ticket oluşturması için ticket menüsü gönderir."
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const himuraembed = new EmbedBuilder()
            .setTitle("🎫 Destek & Ticket Merkezi")
            .setColor("#00d4ff")
            .setAuthor({
                name: `${interaction.guild.name} • Destek Merkezi`,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
            })
            .setThumbnail(Config.discord.serverLogo)
            .setDescription(
                "**Hoş Geldiniz!** 🎉\n\nAşağıdaki menüden ihtiyacınız olan kategoriyi seçerek ticket açabilirsiniz.\n\n```md\n# Mevcut Kategoriler:\n• Satın Alım - Ürün satın alma işlemleri\n• Destek - Teknik destek ve yardım\n• Partnerlik - İş ortaklığı başvuruları\n• Diğer - Diğer tüm konular\n```\n\n> ⚠️ **Önemli:** Gereksiz ticket açmayın, aksi takdirde ticket kapatılacaktır."
            )
            .addFields(
                {
                    name: "📋 Ticket Açma Rehberi",
                    value: "1️⃣ Menüden bir kategori seç.\n2️⃣ Ticket kanalın otomatik olarak oluşturulacak.\n3️⃣ Yetkililerimiz en kısa sürede seninle ilgilenecek!",
                    inline: false
                },
                {
                    name: "⏰ Ortalama Yanıt Süresi",
                    value: "Genellikle **5-30 dakika** içinde dönüş sağlanır.",
                    inline: true
                },
                {
                    name: "🔒 Gizlilik Garantisi",
                    value: "Ticket'ların **sadece sen ve yetkililer** tarafından görülür.",
                    inline: true
                },
                {
                    name: "💡 İpucu",
                    value: "Açık ve net bilgi verirsen daha hızlı yardımcı olabiliriz!",
                    inline: false
                }
            )
            .setFooter({
                text: `PXDevelopment • Ticket Sistemi | ${interaction.guild.name}`,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setTimestamp();

        const himurainmenusu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("ticket-olustur")
                .setPlaceholder("Bir kategori seçin...")
                .addOptions([
                    {
                        label: "💡 Satın Alım",
                        description: "Satın alım",
                        value: "satinalim",
                    },
                    {
                        label: "🛠️ Destek Talebi",
                        description: "Genel destek almak için.",
                        value: "destek",
                    },
                    {
                        label: "🤝 Partnerlik Başvurusu",
                        description: "Partnerlik başvurusu için.",
                        value: "partnerlik",
                    },
                    {
                        label: "❓ Diğer",
                        description: "Diğer tüm konular için.",
                        value: "diğer",
                    },
                    {
                        label: "🔄 Seçenek Sıfırla",
                        description: "Menüdeki seçeneğinizi sıfırlarsınız.",
                        value: "sifirla",
                    },
                ])
        );
        await interaction.reply({
            content: "Ticket oluşturma menüsü gönderiliyor...",
            flags: MessageFlags.Ephemeral
        });

        await interaction.channel.send({
            content: `@everyone & @here`,
            embeds: [himuraembed],
            components: [himurainmenusu],
        });

        await interaction.editReply({
            content: "Ticket oluşturma menüsü gönderildi.",
        });
    },
};
