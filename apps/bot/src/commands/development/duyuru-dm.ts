import {
    SlashCommandBuilder,
    Role,
    GuildMember,
    ChatInputCommandInteraction
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('duyuru-dm')
    .setDescription('Seçilen bir roldeki tüm kullanıcılara DM den mesaj gönderir.')
    .addRoleOption(option =>
        option.setName('rol')
            .setDescription('Seçilecek rol')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('mesaj')
            .setDescription('Gönderilecek mesaj')
            .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const role = interaction.options.getRole('rol') as Role;
    const message = interaction.options.getString('mesaj', true);

    if (!role || !interaction.guild) {
        
        return interaction.reply({
            content: 'Geçerli bir rol veya sunucu bulunamadı.',
            flags: 64
        });
    }

    await interaction.reply({
        content: `${role.name} rolüne sahip üyelere DM gönderiliyor...`,
        flags: 64
    });

    const members = await interaction.guild.members.fetch();
    const hedefUyeler = members.filter(m => m.roles.cache.has(role.id));

    let basarili = 0;
    let basarisiz = 0;

    for (const [, member] of hedefUyeler) {
        try {
            await member.send(`📢 **Duyuru:**\n${message}`);
            basarili++;
        } catch (err) {
            console.error(`DM gönderilemedi: ${member.user.tag}`);
            basarisiz++;
        }
    }

    await interaction.followUp({
        content: `✅ DM gönderimi tamamlandı. Başarılı: ${basarili}, Başarısız: ${basarisiz}`,
        flags: 64
    });
}
