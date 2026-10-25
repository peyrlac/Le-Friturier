const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const animatedCount = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size;
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🤡')
        .replace(`{name}`, `Animated Emojis: ${animatedCount || '0'}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'AnimatedEmojis', successKey: 'serverstats.animatedEmojisCreated' });
}

