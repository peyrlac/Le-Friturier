const Schema = require('../../database/models/notes');

module.exports = async (client, interaction) => {
    const entries = await Schema.find({ Guild: interaction.guild.id, User: interaction.user.id });
    if (!entries.length) return client.errNormal({ key: 'notes.none', type: 'editreply' }, interaction);
    const title = await client.t(interaction, 'notes.leaderboardTitle', { user: interaction.user.username });
    const rows = await Promise.all(entries.map(entry => client.t(interaction, 'notes.entry', { id: entry.Code, note: entry.Note })));
    return client.createLeaderboard(title, rows, interaction);
};
