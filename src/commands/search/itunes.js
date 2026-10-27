const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = async (client, interaction, args) => {

    const song = interaction.options.getString('song');

    const r = await pop.itunes(song).catch(e => {
        return client.errNormal({
            key: 'search.songNotFound',
            type: 'editreply'
        }, interaction)
    });
    if (!r) return;

    client.embed({
        title: `🎶・${r.name}`,
        thumbnail: r.thumbnail,
        url: r.url,
        fields: [
            {
                name: await client.t(interaction, 'search.song.name'),
                value: `${r.name}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.song.artist'),
                value: `${r.artist}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.song.album'),
                value: `${r.album}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.song.length'),
                value: `${r.length}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.song.genre'),
                value: `${r.genre}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.song.price'),
                value: `${r.price}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.song.releaseDate'),
                value: `<t:${Math.round(new Date(r.release_date).getTime() / 1000)}>`,
                inline: true,
            },
        ],
        type: 'editreply'
    }, interaction)
}


