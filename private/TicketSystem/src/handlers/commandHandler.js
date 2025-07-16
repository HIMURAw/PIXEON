const { Collection, EmbedBuilder, MessageFlags } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Komutlar dizini: private/commands/ (proje kökünden bakınca)
const commandsPath = path.join(__dirname, '../commands');
let commandFiles = [];
if (fs.existsSync(commandsPath)) {
    commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
} else {
    console.error('[PX Ticket] Komut klasörü bulunamadı:', commandsPath);
}
const commandMap = new Collection();

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
        commandMap.set(command.data.name, command);
        console.log(`[PX Ticket] Yüklendi: ${command.data.name}`);
    } else {
        console.log(`Hata: ${file} dosyasında komut bilgileri eksik.`);
    }
}
                
module.exports = {
    commandMap: commandMap,
    handleCommand: async (interaction) => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        const command = commandMap.get(commandName);
        try {
            if (command) {
                await command.execute(interaction);
            } else {
                await interaction.reply({
                    content: "Unknown command!",
                    flags: MessageFlags.Ephemeral
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                flags: MessageFlags.Ephemeral
            });
        }
    },
};
