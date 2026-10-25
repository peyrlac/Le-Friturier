const Schema = require('../../database/models/messageRewards');

module.exports = async (client, interaction) => {
    const messages = interaction.options.getNumber('amount');
    const data = await Schema.findOne({ Guild: interaction.guild.id, Messages: messages });
    if (!data) return client.errNormal({ key: 'messages.rewardNotFound', variables: { messages }, type: 'editreply' }, interaction);
    await Schema.findOneAndDelete({ Guild: interaction.guild.id, Messages: messages });
    return client.succNormal({ key: 'messages.rewardRemoved', variables: { messages }, fields: [{ name: await client.t(interaction, 'messages.total'), value: String(messages), inline: true }], type: 'editreply' }, interaction);
};
