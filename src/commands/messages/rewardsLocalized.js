const Schema = require('../../database/models/messageRewards');

module.exports = async (client, interaction) => {
    const entries = await Schema.find({ Guild: interaction.guild.id });
    if (!entries.length) return client.errNormal({ key: 'messages.noRewards', type: 'editreply' }, interaction);
    const title = await client.t(interaction, 'messages.rewardsTitle', { guild: interaction.guild.name });
    const rows = await Promise.all(entries.map(entry => client.t(interaction, 'messages.rewardEntry', { count: entry.Messages, role: entry.Role })));
    return client.createLeaderboard(title, rows, interaction);
};
