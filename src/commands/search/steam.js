const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = async (client, interaction, args) => {
    await interaction.deferReply();

    const name = interaction.options.getString('name');

    const s = await pop.steam(name).catch(e => {
        return client.errNormal({
            key: 'search.applicationNotFound',
            type: 'editreply'
        }, interaction)
    });
    if (!s) return;

    await client.embed({
        title: `🎮・${s.name}`,
        thumbnail: s.thumbnail,
        fields: [
            {
                name: await client.t(interaction, 'search.application.name'),
                value: `${s.name}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.application.description'),
                value: `${s.description}`,
                inline: false,
            },
            {
                name: await client.t(interaction, 'search.application.developers'),
                value: `${s.developers.join(", ")}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.application.publishers'),
                value: `${s.publishers.join(", ")}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.application.price'),
                value: `${s.price}`,
                inline: true,
            }
        ],
        type: 'editreply'
    }, interaction)
}

 
