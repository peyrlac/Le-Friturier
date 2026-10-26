const Discord = require('discord.js');
const isgd = require('isgd');

module.exports = async (client, interaction, args) => {

    const url = interaction.options.getString('site');
    const code = interaction.options.getString('code');

    isgd.custom(url, code, async function(res) {
        if (res.startsWith("Error")) return client.errNormal({
            key: 'tools.remoteUrlError',
            variables: { error: res.replace("Error: ", "") },
            type: 'editreply'
        }, interaction)

        client.succNormal({
            key: 'tools.shortenedUrlCreated',
            fields: [
                {
                    name: await client.t(interaction, 'tools.linkLabel'),
                    value: `${res}`,
                    inline: true,
                }
            ],
            type: 'editreply'
        }, interaction);
    });
}


