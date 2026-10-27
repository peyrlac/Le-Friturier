const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '💎')
        .replace(`{name}`, `Boosts: ${interaction.guild.premiumSubscriptionCount || '0'}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'Boost', successKey: 'serverstats.boostsCreated' });
}

