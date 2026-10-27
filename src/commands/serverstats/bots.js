const createStatsChannel = require('../../handlers/serverstats/createStatsChannel');

module.exports = async (client, interaction) => {
    const guildMembers = await interaction.guild.members.fetch();
    const localizedChannelName = (await client.getTemplate(interaction.guild))
        .replace(`{emoji}`, '🤖')
        .replace(`{name}`, `Bots: ${guildMembers.filter(member => member.user.bot).size || 0}`);
    return createStatsChannel(client, interaction, { channelName: localizedChannelName, field: 'Bots', successKey: 'serverstats.botsCreated' });
}

