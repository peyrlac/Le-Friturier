const Schema = require('../../database/models/messages');

module.exports = async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getNumber('amount');
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (!data) return client.errNormal({ key: 'messages.noData', variables: { user }, type: 'editreply' }, interaction);
    data.Messages -= amount;
    await data.save();
    return client.succNormal({ key: 'messages.removed', variables: { amount, user }, fields: [{ name: await client.t(interaction, 'messages.total'), value: String(data.Messages), inline: true }], type: 'editreply' }, interaction);
};
