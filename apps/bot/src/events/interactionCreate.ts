import { Events, Interaction, ChatInputCommandInteraction, ModalSubmitInteraction } from 'discord.js';
import { CustomClient, Command } from '../types';

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction & { client: CustomClient }) {
        // Modal submit ise
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'yaz_modal') {
                const mesaj = interaction.fields.getTextInputValue('mesaj_input');
                const kanal = interaction.channel;

                if (
                    kanal?.isTextBased() &&
                    ('send' in kanal) &&
                    typeof kanal.send === 'function'
                ) {
                    await kanal.send(`${mesaj}`);
                }


                await interaction.reply({
                    content: '✅ Mesaj başarıyla gönderildi!',
                    ephemeral: true,
                });
            }

            return; // Modal submit işlemi yapıldıysa diğer komutlara geçme
        }

        // Slash komutu değilse çık
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName) as Command | undefined;

        if (!command) {
            console.warn(`Komut bulunamadı: ${interaction.commandName}`);
            await interaction.reply({ content: 'Bu komut artık mevcut değil.', ephemeral: true });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Komut çalıştırılırken hata oluştu: ${interaction.commandName}`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Komutu çalıştırırken bir hata oluştu.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Komutu çalıştırırken bir hata oluştu.', ephemeral: true });
            }
        }
    }
};
