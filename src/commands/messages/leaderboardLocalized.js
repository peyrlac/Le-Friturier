const Schema = require('../../database/models/messages');

module.exports = async (client, interaction) => {
    const entries = await Schema.find({ Guild: interaction.guild.id }).sort([['Messages', 'descending']]);
    if (!entries.length) return client.errNormal({ key: 'messages.noLeaderboard', type: 'editreply' }, interaction);
    const title = await client.t(interaction, 'messages.leaderboardTitle', { guild: interaction.guild.name });
    const rows = await Promise.all(entries.map((entry, index) => client.t(interaction, 'messages.leaderboardEntry', { rank: index + 1, user: entry.User, count: entry.Messages })));
    return client.createLeaderboard(title, rows, interaction);
};
