const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

    await Schema.findOneAndDelete({ _id: data._id });
    return client.succNormal({ key: 'profile.deleted', type: 'editreply' }, interaction);
}

