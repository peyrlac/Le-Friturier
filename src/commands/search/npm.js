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
                name: "💬┇Name",
                value: `${r.name}`,
                inline: true,
            },
            {
                name: "🏷️┇Version",
                value: `${r.version}`,
                inline: true,
            },
            {
                name: "📃┇Description",
                value: `${r.description}`,
                inline: true,
            },
            {
                name: "⌨️┇Keywords",
                value: `${r.keywords}`,
                inline: true,
            },
            {
                name: "💻┇Author",
                value: `${r.author}`,
                inline: true,
            },
            {
                name: "📁┇Downloads",
                value: `${r.downloads_this_year}`,
                inline: true,
            },
            {
                name: "⏰┇Last publish",
                value: `<t:${Math.round(new Date(r.last_published).getTime() / 1000)}>`,
                inline: true,
            },
        ],
        type: 'editreply'
    }, interaction)
}


