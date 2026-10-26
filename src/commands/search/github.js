const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = async (client, interaction, args) => {

    let name = interaction.options.getString('name');

    const r = await pop.github(name).catch(() => {
        return client.errNormal({
            key: 'search.githubNotFound',
            variables: { name },
            type: 'editreply'
        }, interaction)

    });
    if (!r) return;

    client.embed({
        title: `🏷️・${r.name}`,
        thumbnail: r.avatar,
        url: r.url,
        fields: [
            {
                name: await client.t(interaction, 'search.github.name'),
                value: `${r.name}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.github.company'),
                value: `${r.company}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.github.bio'),
                value: `${r.bio}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.github.repositories'),
                value: `${r.public_repos}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.github.createdAt'),
                value: `<t:${Math.round(new Date(r.created_at).getTime() / 1000)}>`,
                inline: true,
            },
        ], type: 'editreply'
    }, interaction)
}


