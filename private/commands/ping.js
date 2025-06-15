const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong and shows bot latency'),
    async execute(interaction) {
        const startTime = Date.now();
        await interaction.reply({ content: 'Pinging...' });
        const endTime = Date.now();
        const latency = endTime - startTime;
        const apiLatency = Math.round(interaction.client.ws.ping);



        await interaction.editReply({
            content: `🏓 Pong!\n🤖 Bot Latency: ${latency}ms\n🌐 API Latency: ${apiLatency}ms`
        });
    },
};
