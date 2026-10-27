const Discord = require('discord.js');

const createProgressBar = require('../../handlers/music/createProgressBar');

module.exports = async (client, interaction, args) => {
    const player = client.player.players.get(interaction.guild.id);

    const channel = interaction.member.voice.channel;
    if (!channel) return client.errNormal({
        key: 'music.notInVoice',
        type: 'editreply'
    }, interaction);

    if (player && (channel.id !== player?.voiceChannel)) return client.errNormal({
        key: 'music.notSameVoice',
        type: 'editreply'
    }, interaction);

    if (!player || !player.queue.current) return client.errNormal({
        key: 'music.noSongs',
        type: 'editreply'
    }, interaction);

    const musicLength = (player.queue.current.isStream ? null : ((!player.queue.current || !player.queue.current.duration || isNaN(player.queue.current.duration)) ? null : player.queue.current.duration))
    const nowTime = (!player.position || isNaN(player.position)) ? null : player.position;

    const bar = await createProgressBar(musicLength, nowTime);

    client.embed({
        title: `${client.emotes.normal.music}・${player.queue.current.title}`,
        url: player.queue.current.uri,
        thumbnail: player.queue.current?.thumbnail ? player.queue.current?.thumbnail : '',
        fields: [
            {
                name: `👤┆Demandé par`,
                value: `${player.queue.current.requester}`,
                inline: true
            },
            {
                name: `${client.emotes.normal.clock}┆Durée`,
                value: `<t:${((Date.now() / 1000) + (player.queue.current.duration / 1000) - nowTime / 1000).toFixed(0)}:f>`,
                inline: true
            },
            {
                name: `${client.emotes.normal.volume}┆Volume`,
                value: `${player.volume}%`,
                inline: true
            },
            {
                name: `${client.emotes.normal.music}┆Progrès`,
                value: `${new Date(player.position).toISOString().slice(11, 19)} ┃ ` +
                    bar +
                    ` ┃ ${new Date(player.queue.current.duration).toISOString().slice(11, 19)}`,
                inline: false
            }
        ],
        type: 'editreply'
    }, interaction)
}


