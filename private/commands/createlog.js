const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const Config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-log')
        .setDescription('Gizli bir kategori, log kanalları ve webhooklar oluşturur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.reply({ content: 'Log kategorisi, kanalları ve webhooklar oluşturuluyor...', flags: 64 });

        const guild = interaction.guild;
        const invokingChannel = interaction.channel;

        try {
            // Gizli kategori oluştur
            const category = await guild.channels.create({
                name: '⚫PXDEV | Web Logs',
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    }
                ]
            });

            const channelNames = [
                '⚫・satış-log',
                '⚫・yorum-log',
                '⚫・sistem-log',
                '⚫・geliştirici-log',
                '⚫・loginlogout-log',
                '⚫・öneri-log',
                '⚫・ticket-log'
            ];

            const webhookInfoList = [];

            for (const name of channelNames) {
                const channel = await guild.channels.create({
                    name,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel],
                        }
                    ]
                });

                // Webhook adı sabit: PXDevelopment
                const webhook = await channel.createWebhook({
                    name: Config.discord.log.WebhookName,
                    avatar: Config.discord.log.WebhookLogoURL,
                    reason: 'PXDevelopment tarafından otomatik oluşturuldu.',
                });

                webhookInfoList.push({
                    name,
                    url: webhook.url
                });
            }

            const webhookMessage = webhookInfoList.map(info => `**${info.name}** → \`${info.url}\``).join('\n');

            await invokingChannel.send({
                content: `✅ **Webhooklar oluşturuldu:**\n${webhookMessage}`
            });

            await interaction.editReply({
                content: `✅ ${channelNames.length} kanal ve PXDevelopment adında webhooklar başarıyla oluşturuldu.`
            });

        } catch (err) {
            console.error('Hata:', err);
            await interaction.editReply({ content: '❌ Bir hata oluştu. Konsolu kontrol et.' });
        }
    }
};
