const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = async (client, interaction, args) => {

    const name = interaction.options.getString('name');

    const r = await pop.npm(name).catch(e => {
        return client.errNormal({
            key: 'search.packageNotFound',
            type: 'editreply'
        }, interaction)
    });
    if (!r) return;

    client.embed({
        title: `📁・${r.name}`,
        fields: [
            {
                name: await client.t(interaction, 'search.package.name'),
                value: `${r.name}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.package.version'),
                value: `${r.version}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.package.description'),
                value: `${r.description}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.package.keywords'),
                value: `${r.keywords}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.package.author'),
                value: `${r.author}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.package.downloads'),
                value: `${r.downloads_this_year}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.package.lastPublish'),
                value: `<t:${Math.round(new Date(r.last_published).getTime() / 1000)}>`,
                inline: true,
            },
        ],
        type: 'editreply'
    }, interaction)
}


