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

    if (!player || !player.queue.current) return client.errNormal({
        key: 'music.noSongs',
        type: 'editreply'
    }, interaction);

    player.setTrackRepeat(!player.trackRepeat);
    const trackRepeat = player.trackRepeat ? "activé" : "désactivé";

    client.succNormal({
        key: 'music.loop',
        variables: { status: trackRepeat },
        type: 'editreply'
    }, interaction);
}


