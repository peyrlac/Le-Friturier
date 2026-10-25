const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🔔')
        .replace(`{name}`, `Roles: ${interaction.guild.roles.cache.size.toLocaleString()}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'Roles', successKey: 'serverstats.rolesCreated' });
}

