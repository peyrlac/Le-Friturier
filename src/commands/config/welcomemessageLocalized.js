const Schema = require('../../database/models/inviteMessages');

module.exports = async (client, interaction) => {
    const message = interaction.options.getString('message');
    if (message.toUpperCase() === 'HELP') return client.embed({ titleKey: 'config.welcomemessage.helpTitle', descKey: 'config.welcomemessage.help', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (message.toUpperCase() === 'DEFAULT') {
        if (data) {
            data.inviteJoin = null;
            await data.save();
        }
        return client.succNormal({ key: 'config.welcomemessage.deleted', type: 'editreply' }, interaction);
    }
    if (data) {
        data.inviteJoin = message;
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, inviteJoin: message }).save();
    }
    return client.succNormal({ key: 'config.welcomemessage.success', variables: { message }, fields: [{ name: await client.t(interaction, 'config.messageField'), value: message, inline: true }], type: 'editreply' }, interaction);
};
