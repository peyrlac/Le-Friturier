const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {

    const text = interaction.options.getString('text');

    let encode = text.split("").map(x => x.charCodeAt(0).toString(2)).join(" ");

    client.embed({
        title: `${client.emotes.normal.check}・${await client.t(interaction, 'tools.encodeTitle')}`,
        desc: await client.t(interaction, 'tools.encodeDescription'),
        fields: [
            {
                name: await client.t(interaction, 'tools.input'),
                value: `\`\`\`${text}\`\`\``,
                inline: false,
            },
            {
                name: await client.t(interaction, 'tools.output'),
                value: `\`\`\`${encode}\`\`\``,
                inline: false,
            },
        ],
        type: 'editreply'
    }, interaction)

}

