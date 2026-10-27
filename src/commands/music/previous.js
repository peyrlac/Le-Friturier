const Discord = require('discord.js');

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

    if (!player || !player.queue.previous) return client.errNormal({
        key: 'music.previousUnavailable',
        type: 'editreply'
    }, interaction);

    const track = player.queue.previous;

    let row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setEmoji("⏮️")
                .setCustomId("Bot-musicprev")
                .setStyle(Discord.ButtonStyle.Primary),

            new Discord.ButtonBuilder()
                .setEmoji("⏸️")
                .setCustomId("Bot-musicpause")
                .setStyle(Discord.ButtonStyle.Primary),

            new Discord.ButtonBuilder()
                .setEmoji("⏹️")
                .setCustomId("Bot-musicstop")
                .setStyle(Discord.ButtonStyle.Primary),

            new Discord.ButtonBuilder()
                .setEmoji("⏭️")
                .setCustomId("Bot-musicnext")
                .setStyle(Discord.ButtonStyle.Primary),
        );

    client.embed({
        title: `${client.emotes.normal.music}・${track.title}`,
        url: track.uri,
        descKey: 'music.startedInVoice',
        variables: { channel: player.voiceChannel },
        thumbnail: track.thumbnail,
        fields: [
            {
                name: `👤┆Demandé par`,
                value: `${track.requester}`,
                inline: true
            },
            {
                name: `${client.emotes.normal.clock}┆Fini à`,
                value: `<t:${((Date.now() / 1000) + (track.length / 1000)).toFixed(0)}:f>`,
                inline: true
            },
            {
                name: `🎬┆Auteur`,
                value: `${track.author}`,
                inline: true
            }
        ],
        components: [row],
        type: 'editreply'
    }, interaction)

    player.play(player.queue.previous)
}


