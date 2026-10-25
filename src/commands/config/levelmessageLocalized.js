const Schema = require('../../database/models/levelMessages');

module.exports = async (client, interaction) => {
    const message = interaction.options.getString('message');
    if (message.toUpperCase() === 'HELP') return client.embed({ titleKey: 'config.levelmessage.helpTitle', descKey: 'config.levelmessage.help', type: 'editreply' }, interaction);

    if (message.toUpperCase() === 'DEFAULT') {
        await Schema.findOneAndDelete({ Guild: interaction.guild.id });
        return client.succNormal({ key: 'config.levelmessage.deleted', type: 'editreply' }, interaction);
    }

    const data = await Schema.findOne({ Guild: interaction.guild.id });
    if (data) {
        data.Message = message;
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, Message: message }).save();
    }
    return client.succNormal({ key: 'config.levelmessage.success', variables: { message }, fields: [{ name: await client.t(interaction, 'config.messageField'), value: message, inline: true }], type: 'editreply' }, interaction);
};
