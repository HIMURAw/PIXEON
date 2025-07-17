const { Events } = require('discord.js');
const Config = require('../../config.js');
const { pool } = require('../DB/connect');
const satinalEvents = require('./satinalEvents');

// Map'ler ve global değişkenler
const urunSilSecimMap = new Map();
const satinalSecimMap = new Map();
if (!global.partnerBasvuruMap) global.partnerBasvuruMap = new Map();
const partnerLogChannelId = Config.discord.partnerBot?.logChannel;
const partnerCategoryId = Config.discord.partnerBot?.categoryId;

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const client = interaction.client;
        // Slash command handler
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: 64 });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: 64 });
                }
            }
        }
        // Satın al interactionları
        if (interaction.isStringSelectMenu() && interaction.customId === 'satinal_urun_sec') {
            return satinalEvents.handleSatinalSelect(interaction);
        }
        if (interaction.isButton() && interaction.customId === 'satinal_satin_al') {
            return satinalEvents.handleSatinalButton(interaction);
        }
        if (interaction.isButton() && (interaction.customId.startsWith('satinal_onayla_') || interaction.customId.startsWith('satinal_reddet_'))) {
            return satinalEvents.handleSatinalAdmin(interaction);
        }
        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith('sendMessageModal-')) {
                const [modalId, channelId] = interaction.customId.split('-');
                const message = interaction.fields.getTextInputValue('messageInput');
                const channel = interaction.guild.channels.cache.get(channelId);
                if (!channel) {
                    return interaction.reply({ content: '❌ Kanal bulunamadı.', flags: 64 });
                }
                const embed = new (require('discord.js').EmbedBuilder)()
                    .setColor('#3498db')
                    .setTitle('📢 Yeni Duyuru')
                    .setDescription(message)
                    .setFooter({ text: `Gönderen: ${interaction.user.tag}` })
                    .setTimestamp();
                await channel.send({ content: '@everyone | @Here', embeds: [embed] });
                await interaction.reply({ content: `✅ Duyuru başarıyla ${channel} kanalına gönderildi!`, flags: 64 });
            }
            if (interaction.customId === 'sendPlainMessageModal') {
                const message = interaction.fields.getTextInputValue('plainMessageInput');
                await interaction.channel.send(message);
                await interaction.reply({ content: '✅ Mesaj başarıyla gönderildi!', flags: 64 });
            }
            if (interaction.customId === 'partnerBasvuruModal') {
                const serverName = interaction.fields.getTextInputValue('partner_server_name');
                const invite = interaction.fields.getTextInputValue('partner_invite');
                const desc = interaction.fields.getTextInputValue('partner_desc');
                const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
                const embed = new EmbedBuilder()
                    .setColor('#00b894')
                    .setTitle('Yeni Partner Başvurusu')
                    .addFields(
                        { name: 'Sunucu İsmi', value: serverName },
                        { name: 'Davet Linki', value: invite },
                        { name: 'Tanıtım Yazısı', value: desc }
                    )
                    .setFooter({ text: `Başvuran: ${interaction.user.tag}` })
                    .setTimestamp();
                const approveBtn = new ButtonBuilder()
                    .setCustomId(`partner_onayla_${interaction.user.id}`)
                    .setLabel('Onayla')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅');
                const declineBtn = new ButtonBuilder()
                    .setCustomId(`partner_reddet_${interaction.user.id}`)
                    .setLabel('Reddet')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌');
                const row = new ActionRowBuilder().addComponents(approveBtn, declineBtn);
                const logChannel = interaction.guild.channels.cache.get(partnerLogChannelId);
                if (logChannel) {
                    await logChannel.send({ embeds: [embed], components: [row] });
                }
                await interaction.reply({ content: 'Başvurunuz alınmıştır. En kısa sürede incelenecek.', flags: 64 });
                global.partnerBasvuruMap.set(interaction.user.id, { serverName, invite, desc });
                return;
            }
        }
        if (interaction.isStringSelectMenu() && interaction.customId === 'urunsil_urun_sec') {
            urunSilSecimMap.set(interaction.user.id, interaction.values[0]);
            await interaction.reply({ content: 'Silmek istediğiniz ürünü seçtiniz. Şimdi "Sil" butonuna tıklayın.', flags: 64 });
            return;
        }
        if (interaction.isButton() && interaction.customId === 'urunsil_sil') {
            const selectedProductId = urunSilSecimMap.get(interaction.user.id);
            if (!selectedProductId) {
                await interaction.reply({ content: 'Lütfen önce bir ürün seçin.', flags: 64 });
                return;
            }
            try {
                await pool.query('DELETE FROM discord_products WHERE id = ?', [selectedProductId]);
                urunSilSecimMap.delete(interaction.user.id);
                await interaction.reply({ content: '✅ Ürün başarıyla silindi.', flags: 64 });
            } catch (err) {
                console.error('Ürün silinirken hata:', err);
                await interaction.reply({ content: '❌ Ürün silinirken bir hata oluştu.', flags: 64 });
            }
            return;
        }
        if (interaction.isButton() && (interaction.customId.startsWith('partner_onayla_') || interaction.customId.startsWith('partner_reddet_'))) {
            const [, action, userId] = interaction.customId.split('_');
            const basvuru = global.partnerBasvuruMap?.get(userId);
            if (!basvuru) {
                await interaction.reply({ content: 'Başvuru bilgisi bulunamadı.', flags: 64 });
                return;
            }
            if (action === 'onayla') {
                const newChannel = await interaction.guild.channels.create({
                    name: basvuru.serverName,
                    type: 0, // GUILD_TEXT
                    parent: partnerCategoryId
                });
                await newChannel.send({
                    content: `**${basvuru.serverName}**\n${basvuru.invite}\n\n${basvuru.desc}`
                });
                await interaction.reply({ content: 'Başvuru onaylandı ve kanal açıldı.', flags: 64 });
            } else {
                await interaction.reply({ content: 'Başvuru reddedildi.', flags: 64 });
            }
            global.partnerBasvuruMap.delete(userId);
            return;
        }
    }
}; 