const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '👤')
        .replace(`{name}`, `Members: ${interaction.guild.memberCount.toLocaleString()}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'Members', successKey: 'serverstats.membersCreated' });
}

