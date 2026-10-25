const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const text = interaction.options.getString('text');

    if (text.length >= 2000) return client.errNormal({
        key: 'fun.sayTooLong',
        type: 'editreply'
    }, interaction);

    await interaction.followUp({ content: client.removeMentions(text) }).then(() => {
        client.succNormal({
            key: 'fun.messageSent',
            type: 'ephemeraledit'
        }, interaction)
    })
}


