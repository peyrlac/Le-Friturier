const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {
    const data = await Schema.findOne({ User: interaction.user.id });
    if (data) {
        return client.errNormal({ key: 'profile.alreadyExists', type: 'editreply' }, interaction);
    }

    await new Schema({ User: interaction.user.id }).save();
    return client.succNormal({ key: 'profile.created', type: 'editreply' }, interaction);
}

