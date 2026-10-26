const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    client.embed({
        title: await client.t(interaction, 'botResponses.changelogsTitle'),
        desc: await client.t(interaction, 'botResponses.changelogs'),
        thumbnail: client.user.avatarURL({ size: 1024 }),
        fields: [{
            name: await client.t(interaction, 'botResponses.changelogEntry'),
                value: await client.t(interaction, 'botResponses.changelogEntryValue'),
                inline: false,
            },
        ],
        type: 'editreply'
    }, interaction)
}

 
