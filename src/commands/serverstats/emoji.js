const Discord = require('discord.js');
const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '😛')
        .replace(`{name}`, `Emojis: ${interaction.guild.emojis.cache.size || '0'}`);
    return createStatsChannel(client, interaction, {
        channelName: localizedChannelName,
        field: 'Emojis',
        successKey: 'serverstats.emojisCreated'
    });
};

