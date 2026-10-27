const Discord = require('discord.js');
const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🔧')
        .replace(`{name}`, `Channels: ${interaction.guild.channels.cache.size.toLocaleString()}`);
    return createStatsChannel(client, interaction, {
        channelName: localizedChannelName,
        field: 'Channels',
        successKey: 'serverstats.channelsCreated'
    });
};

