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

    let amount = interaction.options.getNumber('amount');

    if (!amount) return client.simpleEmbed({
        descKey: 'music.currentVolume',
        variables: { amount: player.volume },
        type: 'editreply'
    }, interaction);

    if (isNaN(amount) || amount === 'Infinity') return client.errNormal({
        key: 'music.invalidNumber',
        type: 'editreply'
    }, interaction);

    if (Math.round(parseInt(amount)) < 1 || Math.round(parseInt(amount)) > 1000) return client.errNormal({
        key: 'music.maxVolume',
        type: 'editreply'
    }, interaction);

    player.setVolume(parseInt(amount))

    client.succNormal({
        key: 'music.volumeSet',
        variables: { amount },
        type: 'editreply'
    }, interaction);
}


