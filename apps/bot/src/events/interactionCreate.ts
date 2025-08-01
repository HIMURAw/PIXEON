import { Events, Interaction, ChatInputCommandInteraction } from 'discord.js';

type Command = {
    data: any;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
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
