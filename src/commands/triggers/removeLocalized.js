const Schema = require('../../database/models/triggers');

module.exports = async (client, interaction) => {
    const alias = interaction.options.getString('alias').toLowerCase();
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    const triggers = data && Array.isArray(data.Triggers) ? data.Triggers : [];
    const index = triggers.findIndex(trigger => trigger.alias === alias);
    if (index < 0) return client.errNormal({ key: data ? 'triggers.notFound' : 'triggers.noData', variables: { alias }, type: 'editreply' }, interaction);

    data.Triggers.splice(index, 1);
    await data.save();
    return client.succNormal({
        key: 'triggers.removed',
        variables: { alias },
        fields: [{ name: await client.t(interaction, 'triggers.alias'), value: `**${alias}**` }],
        type: 'editreply'
    }, interaction);
};
