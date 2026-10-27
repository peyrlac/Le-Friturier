const Schema = require('../../database/models/birthday');

module.exports = async (client, interaction) => {
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'birthdays.notFound', type: 'editreply' }, interaction);
    await Schema.findOneAndDelete({ Guild: interaction.guild.id, User: interaction.user.id });
    return client.succNormal({ key: 'birthdays.deleted', type: 'editreply' }, interaction);
};
