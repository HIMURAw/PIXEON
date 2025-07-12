const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cekilis')
        .setDescription('Çekiliş başlatır.')
        .addStringOption(option =>
            option.setName('odul')
                .setDescription('Çekiliş ödülü')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Çekilişin gönderileceği kanal')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption(option =>
            option.setName('sure')
                .setDescription('Çekiliş süresi (örnek: 1h, 30m, 1d)')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('kazanansayisi')
                .setDescription('Kazanan sayısı')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)
        )
        .addStringOption(option =>
            option.setName('foto')
                .setDescription('Çekiliş fotoğrafının URL adresi (isteğe bağlı)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const prize = interaction.options.getString('odul');
        const channel = interaction.options.getChannel('kanal');
        const timeString = interaction.options.getString('sure');
        const winnersCount = interaction.options.getInteger('kazanansayisi');
        const photo = interaction.options.getString('foto');

        // Süre kontrolü (örnek: 1h, 30m, 1d gibi)
        const timeRegex = /^(\d+)([hmd])$/;
        const timeMatch = timeString.match(timeRegex);

        if (!timeMatch) {
            return interaction.reply({ content: 'Geçersiz süre formatı. Örnek: 1h, 30m, 1d', flags: 64 });
        }

        const timeValue = parseInt(timeMatch[1]);
        const timeUnit = timeMatch[2];

        let endTime;
        switch (timeUnit) {
            case 'h':
                endTime = Date.now() + (timeValue * 60 * 60 * 1000);
                break;
            case 'm':
                endTime = Date.now() + (timeValue * 60 * 1000);
                break;
            case 'd':
                endTime = Date.now() + (timeValue * 24 * 60 * 60 * 1000);
                break;
            default:
                return interaction.reply({ content: 'Geçersiz süre birimi. h, m, d kullanın.', flags: 64 });
        }

        const embed = new EmbedBuilder()
            .setColor('#ff6b6b')
            .setTitle('🎉 **ÇEKİLİŞ** 🎉')
            .setDescription(`**Ödül:** ${prize}\n\n**Kazanan Sayısı:** ${winnersCount}\n**Bitiş:** <t:${Math.floor(endTime / 1000)}:R>\n\n🎯 Katılmak için **🎉** emojisine tıklayın!`)
            .setFooter({ text: `Çekiliş başlatan: ${interaction.user.tag}` })
            .setTimestamp();

        if (photo && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(photo)) {
            embed.setImage(photo);
        }

        try {
            const giveawayMessage = await channel.send({ embeds: [embed] });
            await giveawayMessage.react('🎉');

            // Çekiliş verilerini sakla (gerçek uygulamada veritabanında saklanmalı)
            const giveawayData = {
                messageId: giveawayMessage.id,
                channelId: channel.id,
                guildId: interaction.guild.id,
                prize: prize,
                winnersCount: winnersCount,
                endTime: endTime,
                hostId: interaction.user.id,
                participants: []
            };

            // Çekiliş bitiş zamanlayıcısı
            setTimeout(async () => {
                try {
                    const message = await channel.messages.fetch(giveawayMessage.id);
                    const reaction = message.reactions.cache.get('🎉');

                    if (reaction) {
                        const users = await reaction.users.fetch();
                        const validParticipants = users.filter(user => !user.bot).map(user => user.id);

                        if (validParticipants.length === 0) {
                            const noWinnerEmbed = new EmbedBuilder()
                                .setColor('#ff0000')
                                .setTitle('❌ Çekiliş Sona Erdi')
                                .setDescription(`**Ödül:** ${prize}\n\nKimse katılmadı! 😢`)
                                .setFooter({ text: 'Çekiliş sona erdi' })
                                .setTimestamp();

                            await message.edit({ embeds: [noWinnerEmbed] });
                            return;
                        }

                        const winners = [];
                        for (let i = 0; i < Math.min(winnersCount, validParticipants.length); i++) {
                            const randomIndex = Math.floor(Math.random() * validParticipants.length);
                            winners.push(validParticipants[randomIndex]);
                            validParticipants.splice(randomIndex, 1);
                        }

                        const winnerMentions = winners.map(id => `<@${id}>`).join(', ');

                        const winnerEmbed = new EmbedBuilder()
                            .setColor('#00ff00')
                            .setTitle('🎉 Çekiliş Sona Erdi!')
                            .setDescription(`**Ödül:** ${prize}\n\n🏆 **Kazananlar:** ${winnerMentions}\n\nTebrikler! 🎊`)
                            .setFooter({ text: 'Çekiliş sona erdi' })
                            .setTimestamp();

                        if (photo && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(photo)) {
                            winnerEmbed.setImage(photo);
                        }

                        await message.edit({ embeds: [winnerEmbed] });
                        await channel.send(`🎉 Tebrikler ${winnerMentions}! **${prize}** kazandınız!`);
                    }
                } catch (error) {
                    console.error('Çekiliş sonlandırılırken hata:', error);
                }
            }, endTime - Date.now());

            await interaction.reply({ content: '✅ Çekiliş başarıyla başlatıldı!', flags: 64 });
        } catch (error) {
            console.error('Çekiliş başlatılırken hata:', error);
            await interaction.reply({ content: '❌ Çekiliş başlatılırken bir hata oluştu.', flags: 64 });
        }
    }
};
