const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const tierMap = { TIER_1: '1', TIER_2: '2', TIER_3: '3', NONE: '0' };
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🥇')
        .replace(`{name}`, `Tier: ${tierMap[interaction.guild.premiumTier] || '0'}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'BoostTier', successKey: 'serverstats.tierCreated' });
}

