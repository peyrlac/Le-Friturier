const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    let name = encodeURIComponent(interaction.options.getString('name'));
    let link = `https://duckduckgo.com/?q=${name}`;

    client.succNormal({
        key: 'search.linkResult',
        variables: { name },
        fields: [
            {
                name: await client.t(interaction, 'search.linkLabel'),
                value: `[${await client.t(interaction, 'search.viewLink')}](${link})`,
                inline: true,
            }
        ], type: 'editreply'
    }, interaction);

}


