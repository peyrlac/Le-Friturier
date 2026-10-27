const Discord = require('discord.js');

const Schema = require("../../database/models/invites");
const localizedLeaderboard = require('./leaderboardLocalized');

module.exports = async (client, interaction, args) => {
    return localizedLeaderboard(client, interaction, args);
    const rawLeaderboard = await Schema.find({ Guild: interaction.guild.id }).sort(([['Invites', 'descending']]));

    if (!rawLeaderboard.length) return client.errNormal({
        key: 'invites.noData',
        variables: { user: interaction.guild.name },
        type: 'editreply'
    }, interaction);

    const lb = rawLeaderboard.map(e => `**${rawLeaderboard.findIndex(i => i.Guild === interaction.guild.id && i.User === e.User) + 1}** | <@!${e.User}> - Invites: \`${e.Invites}\``);

    await client.createLeaderboard(`📨・Invites - ${interaction.guild.name}`, lb, interaction);
}

