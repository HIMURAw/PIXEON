const { Events } = require('discord.js');
const Config = require('../../config.js');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');

function joinVoice(client) {
    let channel = client.channels.cache.get(Config.discord.voicechannel);
    if (!channel) return console.error('[Bot] Ses kanalı bulunamadı!');
    // Zaten bağlıysa tekrar bağlanma
    const existing = getVoiceConnection(channel.guild.id);
    if (existing && existing.joinConfig.channelId === channel.id) return;
    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
    console.log('\x1b[32m[Bot]\x1b[0m Ses kanalına bağlandı:', channel.name);
}

module.exports = [
    {
        name: Events.VoiceStateUpdate,
        async execute(oldState, newState, client) {
            const channelId = Config.discord.voicechannel;
            if (newState.id === client.user.id) {
                if (!newState.channelId || newState.channelId !== channelId) {
                    setTimeout(() => joinVoice(client), 2000);
                }
            }
        }
    },
    {
        name: Events.ClientReady,
        once: true,
        async execute(client) {
            setTimeout(() => joinVoice(client), 2000);
        }
    }
]; 