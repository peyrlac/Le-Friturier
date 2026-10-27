const Schema = require('../../database/models/invites');

module.exports = async (client, interaction) => {
    const entries = await Schema.find({ Guild: interaction.guild.id }).sort([['Invites', 'descending']]);
    if (!entries.length) return client.errNormal({ key: 'invites.noData', variables: { user: interaction.guild.name }, type: 'editreply' }, interaction);

    const title = await client.t(interaction, 'invites.leaderboardTitle', { guild: interaction.guild.name });
    const rows = await Promise.all(entries.map((entry, index) => client.t(interaction, 'invites.leaderboardEntry', {
        rank: index + 1,
        user: entry.User,
        invites: entry.Invites
    })));
    return client.createLeaderboard(title, rows, interaction);
};
