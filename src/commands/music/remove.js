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

    let number = interaction.options.getNumber('number');

    if (number > player.queue.size) return client.errNormal({
        key: 'music.queueTooShort',
        type: 'editreply'
    }, interaction);

    const targetSong = player.queue[parseInt(number - 1)]
    player.queue.remove((parseInt(number)) - 1)

    client.succNormal({ 
        key: 'music.removed',
        variables: { song: targetSong.title },
        type: 'editreply'
    }, interaction);
}

 
