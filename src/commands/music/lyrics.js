const Discord = require('discord.js');
const lyricsFinder = require("lyrics-finder");

module.exports = async (client, interaction, args) => {
    let search = "";

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

        if (!interaction.options.getString('song')) {
            search = player.queue.current.title;
        }
        else {
            search = interaction.options.getString('song');
        }

        let lyrics = "";

        try {
            lyrics = await lyricsFinder(search, "");
            if (!lyrics) lyrics = await client.t(interaction, 'music.lyricsNotFound', { song: search });
        } catch (error) {
            lyrics = await client.t(interaction, 'music.lyricsNotFound', { song: search });
        }

        client.embed({
            title: `${client.emotes.normal.music}・Paroles pour ${search}`,
            desc: lyrics,
            type: 'editreply'
        }, interaction)
}


