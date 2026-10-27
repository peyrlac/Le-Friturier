const Schema = require('../../database/models/messages');

module.exports = async (client, interaction) => {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getNumber('amount');
    let data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    if (data) {
        data.Messages += amount;
        await data.save();
    } else {
        data = await new Schema({ Guild: interaction.guild.id, User: user.id, Messages: amount }).save();
    }
    return client.succNormal({ key: 'messages.added', variables: { amount, user }, fields: [{ name: await client.t(interaction, 'messages.total'), value: String(data.Messages), inline: true }], type: 'editreply' }, interaction);
};
