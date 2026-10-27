const Schema = require('../../database/models/levels');

module.exports = async (client, interaction) => {
    const entries = await Schema.find({ guildID: interaction.guild.id }).sort([['xp', 'descending']]).exec();
    if (!entries.length) return client.errNormal({ key: 'levels.noData', type: 'editreply' }, interaction);

    const title = await client.t(interaction, 'levels.leaderboardTitle', { guild: interaction.guild.name });
    const rows = await Promise.all(entries.map((entry, index) => client.t(interaction, 'levels.leaderboardEntry', {
        rank: index + 1,
        user: entry.userID,
        level: entry.level.toLocaleString(),
        xp: entry.xp.toLocaleString()
    })));
    return client.createLeaderboard(title, rows, interaction);
};
