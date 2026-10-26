const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    client.embed({
        title: await client.t(interaction, 'botResponses.ownerTitle'),
        desc: `____________________________`,
        thumbnail: client.user.avatarURL({ dynamic: true, size: 1024 }),
        fields: [{
            name: await client.t(interaction, 'botResponses.ownerName'),
            value: `Corwin`,
            inline: true,
        },
        {
            name: await client.t(interaction, 'botResponses.ownerTag'),
            value: `</Corwin>#0001`,
            inline: true,
        },
        {
            name: await client.t(interaction, 'botResponses.organization'),
            value: `CoreWare`,
            inline: true,
        },
        {
            name: await client.t(interaction, 'botResponses.website'),
            value: `[https://corwindev.nl](https://corwindev.nl)`,
            inline: true,
        }],
        type: 'editreply'
    }, interaction)
}
