const Discord = require('discord.js');

const Schema = require('../../database/models/afk');

module.exports = async (client, interaction, args) => {
    const rawboard = await Schema.find({ Guild: interaction.guild.id })

    if (rawboard.length < 1) return client.errNormal({
        key: 'afk.noData',
        type: 'editreply'
    }, interaction);

    const reason = await client.t(interaction, 'afk.reason');
    const lb = rawboard.map(e => `<@!${e.User}> - **${reason}** ${e.Message}`);

    const title = await client.t('afk.title', { guild: interaction.guild.name });
    return client.createLeaderboard(title, lb, interaction);
}


