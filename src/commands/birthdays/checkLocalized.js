const Schema = require('../../database/models/birthday');

module.exports = async (client, interaction) => {
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'birthdays.notFound', type: 'editreply' }, interaction);
    return client.embed({
        titleKey: 'birthdays.checkTitle',
        descKey: 'birthdays.checkDescription',
        variables: { user: interaction.user.username, birthday: data.Birthday },
        type: 'editreply'
    }, interaction);
};
