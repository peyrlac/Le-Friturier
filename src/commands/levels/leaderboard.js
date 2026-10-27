const Discord = require('discord.js');

const Schema = require("../../database/models/levels");
const localizedLeaderboard = require('./leaderboardLocalized');

module.exports = async (client, interaction, args) => {
    return localizedLeaderboard(client, interaction, args);
    const rawLeaderboard = await Schema.find({ guildID: interaction.guild.id }).sort(([['xp', 'descending']])).exec();

    if (!rawLeaderboard) return client.errNormal({
        error: `No data found!`,
        type: 'editreply'
    }, interaction);

    const lb = rawLeaderboard.map(e => `**${rawLeaderboard.findIndex(i => i.guildID === interaction.guild.id && i.userID === e.userID) + 1}** | <@!${e.userID}> - Level: \`${e.level.toLocaleString()}\` (${e.xp.toLocaleString()} xp)`);

    await client.createLeaderboard(`🆙・Levels - ${interaction.guild.name}`, lb, interaction);
}

