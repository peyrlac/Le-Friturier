const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    let name = encodeURIComponent(interaction.options.getString('name'));
    let link = `https://www.youtube.com/results?search_query=${name}`;

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


