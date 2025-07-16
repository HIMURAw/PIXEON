const { handleCommand } = require("../handlers/commandHandler");
const { CommandInteraction, MessageFlags } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param { CommandInteraction } interaction
     */

    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            handleCommand(interaction);
        }
        // Diğer interaction türleri (button, select menu, modal) ayrı event dosyalarında işleniyor
    },
};
