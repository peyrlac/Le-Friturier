const Schema = require('../../database/models/messages');

module.exports = async (client, interaction) => {
    const user = interaction.options.getUser('user') || interaction.user;
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: user.id });
    const count = data ? data.Messages : 0;
    return client.embed({ titleKey: 'messages.title', descKey: 'messages.description', variables: { user: user.tag, count }, type: 'editreply' }, interaction);
};
