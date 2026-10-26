const Discord = require('discord.js');
const sourcebin = require('sourcebin');

module.exports = async (client, interaction, args) => {

    const language = interaction.options.getString('language');
    const code = interaction.options.getString('code');

    const bin = await sourcebin.create(
        [
            {
                content: `${code}`,
                language: `${language}`,
            },
        ],
        {
            title: await client.t(interaction, 'tools.sourcebinTitle'),
            description: await client.t(interaction, 'tools.sourcebinDescription'),
        },
    ).then(async value => {
        client.succNormal({
            key: 'tools.codePosted',
            fields: [
                {
                    name: await client.t(interaction, 'tools.linkLabel'),
                    value: `[${await client.t(interaction, 'search.viewLink')}](${value.url})`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction);
    })

}


