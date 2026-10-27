const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const staticCount = interaction.guild.emojis.cache.filter(emoji => !emoji.animated).size;
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '😀')
        .replace(`{name}`, `Static Emojis: ${staticCount || '0'}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'StaticEmojis', successKey: 'serverstats.staticEmojisCreated' });
}

