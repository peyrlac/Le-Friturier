const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const message = interaction.options.getString('message');
    const messageId = interaction.options.getString('id');

    const editMessage = await interaction.channel.messages.fetch(messageId);

    client.embed({
        titleKey: 'announcement.title',
        desc: message,
        type: 'edit'
    }, editMessage);

    client.succNormal({
        key: 'announcement.edited',
        type: 'ephemeraledit'
    }, interaction);
}


