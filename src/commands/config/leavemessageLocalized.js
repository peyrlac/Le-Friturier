const Schema = require('../../database/models/inviteMessages');

module.exports = async (client, interaction) => {
    const message = interaction.options.getString('message');
    if (message.toUpperCase() === 'HELP') return client.embed({ titleKey: 'config.leavemessage.helpTitle', descKey: 'config.leavemessage.help', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (message.toUpperCase() === 'DEFAULT') {
        if (data) {
            data.inviteLeave = null;
            await data.save();
        }
        return client.succNormal({ key: 'config.leavemessage.deleted', type: 'editreply' }, interaction);
    }
    if (data) {
        data.inviteLeave = message;
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, inviteLeave: message }).save();
    }
    return client.succNormal({ key: 'config.leavemessage.success', variables: { message }, fields: [{ name: await client.t(interaction, 'config.messageField'), value: message, inline: true }], type: 'editreply' }, interaction);
};
