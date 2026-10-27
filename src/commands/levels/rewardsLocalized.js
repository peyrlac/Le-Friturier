const Schema = require('../../database/models/levelRewards');

module.exports = async (client, interaction) => {
    const entries = await Schema.find({ Guild: interaction.guild.id });
    if (!entries.length) return client.errNormal({ key: 'config.levels.noRewards', type: 'editreply' }, interaction);

    const title = await client.t(interaction, 'config.levels.rewardsTitle', { guild: interaction.guild.name });
    const rows = await Promise.all(entries.map(entry => client.t(interaction, 'config.levels.rewardEntry', {
        level: entry.Level,
        role: entry.Role
    })));
    return client.createLeaderboard(title, rows, interaction);
};
