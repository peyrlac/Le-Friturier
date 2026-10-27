const Schema = require('../../database/models/invites');

module.exports = async (client, interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    const invites = data ? data.Invites : 0;
    const total = data ? data.Total : 0;
    const left = data ? data.Left : 0;
    const [title, description, totalLabel, leftLabel] = await Promise.all([
        client.t(interaction, 'invites.title'),
        client.t(interaction, 'invites.description', { user: user.tag, invites }),
        client.t(interaction, 'invites.total'),
        client.t(interaction, 'invites.left')
    ]);

    return client.embed({
        title,
        desc: description,
        fields: [
            { name: totalLabel, value: String(total), inline: true },
            { name: leftLabel, value: String(left), inline: true }
        ],
        type: 'editreply'
    }, interaction);
};
