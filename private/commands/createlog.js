const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-log')
        .setDescription('Gizli bir kategori ve log kanalı oluşturur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.reply({ content: 'Log kategorisi ve kanalı oluşturuluyor...', ephemeral: true });

        const guild = interaction.guild;

        try {
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

            const channelNames = ['⚫・satış-log', '⚫・yorum-log', '⚫・sistem-log', '⚫・geliştirici-log', '⚫・hata-log', '⚫・öneri-log', '⚫・ticket-log'];
            const createdChannels = [];

            // Her kanal için sırayla oluştur
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
                createdChannels.push(channel);
            }

            await interaction.editReply({
                content: `✅ Başarıyla kategori ve ${createdChannels.length} gizli kanal oluşturuldu.`
            });

        } catch (err) {
            console.error('Hata:', err);
            await interaction.editReply({ content: '❌ Bir hata oluştu. Konsolu kontrol et.' });
        }
    }
};
