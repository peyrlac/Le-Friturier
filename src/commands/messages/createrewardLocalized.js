const Schema = require('../../database/models/messageRewards');

module.exports = async (client, interaction) => {
    const messages = interaction.options.getNumber('amount');
    const role = interaction.options.getRole('role');
    const data = await Schema.findOne({ Guild: interaction.guild.id, Messages: messages });
    if (data) return client.errNormal({ key: 'messages.rewardExists', type: 'editreply' }, interaction);
    await new Schema({ Guild: interaction.guild.id, Messages: messages, Role: role.id }).save();
    return client.succNormal({ key: 'messages.rewardCreated', variables: { messages }, fields: [{ name: await client.t(interaction, 'messages.role'), value: String(role), inline: true }], type: 'editreply' }, interaction);
};
