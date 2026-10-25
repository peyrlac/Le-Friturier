const Discord = require('discord.js');
const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const count = interaction.guild.channels.cache.filter(channel => channel.type === Discord.ChannelType.GuildVoice).size;
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🔊')
        .replace(`{name}`, `Voice Channels: ${count || 0}`);
    return createStatsChannel(client, interaction, {
        channelName: localizedChannelName,
        field: 'VoiceChannels',
        successKey: 'serverstats.voiceChannelsCreated'
    });
};

