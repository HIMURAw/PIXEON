import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    TextChannel
} from 'discord.js'
import { TestContext } from 'node:test';

export const data = new SlashCommandBuilder()
    .setName('duyuru')
    .setDescription('Bir kanala duyuru göndermenize yarar')
    .addChannelOption(Option =>
        Option.setName('kanal')
            .setDescription('duyurunun atılacağı kanal')
            .setRequired(true)
    )
    .addStringOption(Option =>
        Option.setName('mesaj')
            .setDescription('gönderilecek duyuru içeriği')
            .setRequired(true)
    );

export async function execute(Interaction: ChatInputCommandInteraction) {
    const channel = Interaction.options.getChannel(`kanal`)
    const message = Interaction.options.getString('mesaj')

    if (!channel) {
        console.log('Duyuru atılan kanal bulunamadı.')
        Interaction.reply({ content: 'duyuru atılan kanal buşunamadı yada yanlış kanal seçildi.', flags: 64 });
    }

    await (channel as TextChannel).send(`${message}  @everyone || @HERE`);
    await Interaction.reply({ content: 'Duyuru mesajınız gönderildi.', flags: 64 });
}