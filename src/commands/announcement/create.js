const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel');

    client.embed({
        titleKey: 'announcement.title',
        desc: message
    }, channel);

    client.succNormal({
        key: 'announcement.sent',
        fields: [
            {
                name: await client.t(interaction, 'announcement.channel'),
                value: `${channel} (${channel.name})`
            }
        ],
        type: 'editreply'
    }, interaction);
}


