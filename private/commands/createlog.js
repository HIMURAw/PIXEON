const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const Config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-olustur')
        .setDescription('Gizli bir kategori, log kanalları ve webhooklar oluşturur.'),
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
                '⚫・join-quit-log',
                '⚫・message-log',
                '⚫・voice-log',
                '⚫・role-log',
                '⚫・channel-log',
                '⚫・emoji-log',
                '⚫・invite-log',
                '⚫・server-log',
                '⚫・licanse-log',
                '⚫・ticket-log',
                '⚫・partner-log',
                '⚫・guard-log'
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
            console.error('\x1b[41m[PX-Ticket] HATA\x1b[0m', err);
            await interaction.editReply({ content: '❌ Bir hata oluştu. Konsolu kontrol et.' });
        }
    }
};
