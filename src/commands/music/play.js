const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    if (!interaction.member.voice.channel) return client.errNormal({
        key: 'music.notInVoice',
        type: 'editreply'
    }, interaction);

    let channel = interaction.member.voice ? interaction.member.voice.channel : null;
    if (!channel) return client.errNormal({
        key: 'music.channelMissing',
        type: 'editreply'
    }, interaction);

    let player = client.player.players.get(interaction.guild.id);

    if (player && (channel.id !== player?.voiceChannel)) return client.errNormal({
        key: 'music.notSameVoice',
        type: 'editreply'
    }, interaction);

    if (!player) {
        player = client.player.create({
            guild: interaction.guild.id,
            voiceChannel: channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true
        });

        if (!channel.joinable) return client.errNormal({
            key: 'music.notJoinable',
            type: 'editreply'
        }, interaction);
        player.connect()

        setTimeout(() => {
            if (channel.type == Discord.ChannelType.GuildStageVoice) {
                interaction.guild.members.me.voice.setSuppressed(false);
            }
        }, 500)
    }

    player = client.player.players.get(interaction.guild.id);
    if (player.state !== "CONNECTED") player.connect();

    var query = interaction.options.getString('song');

    client.simpleEmbed({
        descKey: 'music.searching',
        type: 'editreply'
    }, interaction)

    const res = await player.search(query, interaction.user);

    if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        return client.errNormal({
            key: 'music.loadFailed',
            type: 'editreply'
        }, interaction);
    }

    switch (res.loadType) {
        case 'NO_MATCHES': {
            if (!player.queue.current) player.destroy()
            await client.errNormal({
                key: 'music.noMatches',
                type: 'editreply'
            }, interaction);
            break;
        }

        case 'TRACK_LOADED': {
            const track = res.tracks[0];
            await player.queue.add(track);

            if (!player.playing && !player.paused) {
                player.play();
            }
            else {
                client.embed({
                    title: `${client.emotes.normal.music}・${track.title}`,
                    url: track.uri,
                    descKey: 'music.songQueued',
                    thumbnail: track.thumbnail,
                    fields: [
                        {
                            name: `👤┆Requested By`,
                            value: `${track.requester}`,
                            inline: true
                        },
                        {
                            name: `${client.emotes.normal.clock}┆Ends at`,
                            value: `<t:${((Date.now() / 1000) + (track.length / 1000)).toFixed(0)}:f>`,
                            inline: true
                        },
                        {
                            name: `🎬┆Author`,
                            value: `${track.author}`,
                            inline: true
                        }
                    ],
                    type: 'editreply'
                }, interaction)
            }
            break;
        }

        case 'PLAYLIST_LOADED': {
            await player.queue.add(res.tracks);
            if (!player.playing && !player.paused) player.play()
            else {

            }
            break;
        }

        case 'SEARCH_RESULT': {
            let max = 5, collected, filter = (i) => i.user.id === interaction.user.id;
            if (res.tracks.length < max) max = res.tracks.length;

            let row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setEmoji("1️⃣")
                        .setCustomId("1")
                        .setStyle(Discord.ButtonStyle.Secondary),

                    new Discord.ButtonBuilder()
                        .setEmoji("2️⃣")
                        .setCustomId("2")
                        .setStyle(Discord.ButtonStyle.Secondary),

                    new Discord.ButtonBuilder()
                        .setEmoji("3️⃣")
                        .setCustomId("3")
                        .setStyle(Discord.ButtonStyle.Secondary),

                    new Discord.ButtonBuilder()
                        .setEmoji("4️⃣")
                        .setCustomId("4")
                        .setStyle(Discord.ButtonStyle.Secondary),

                    new Discord.ButtonBuilder()
                        .setEmoji("5️⃣")
                        .setCustomId("5")
                        .setStyle(Discord.ButtonStyle.Secondary),
                );

            let row2 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setEmoji("🛑")
                        .setLabel("Cancel")
                        .setCustomId("cancel")
                        .setStyle(Discord.ButtonStyle.Danger),
                );

            const results = res.tracks
                .slice(0, max)
                .map((track, index) => `**[#${++index}]**┆${track.title.length >= 45 ? `${track.title.slice(0, 45)}...` : track.title}`)
                .join('\n');

            client.embed({
                titleKey: 'music.searchResults',
                desc: results,
                fields: [
                    {
                        name: `❓┆${await client.t(interaction, 'music.cancelSearch')}`,
                        value: await client.t(interaction, 'music.cancelSearchHint'),
                        inline: true
                    }
                ],
                components: [row, row2],
                type: 'editreply'
            }, interaction)

            try {
                i = await interaction.channel.awaitMessageComponent({ filter, max: 1, time: 30e3, componentType: Discord.ComponentType.Button, errors: ['time'] });
            } catch (e) {
                if (!player.queue.current) player.destroy();
                row.components.forEach((button) => button.setDisabled(true));
                row2.components.forEach((button) => button.setDisabled(true));
                return client.errNormal({
                    key: 'music.selectionMissing',
                    type: 'editreply',
                    components: [row, row2]
                }, interaction)
            }

            const first = i.customId;
            i.message.delete();
            i.deferUpdate();

            if (first.toLowerCase() === 'cancel') {
                if (!player.queue.current) player.destroy();
                return interaction.followUp({ content: await client.t(interaction, 'music.selectionCancelled') });
            }

            const index = Number(first) - 1;
            if (index < 0 || index > max - 1) return client.errNormal({
                key: 'music.invalidSelection',
                variables: { max },
                type: 'editreply'
            }, interaction)

            const track = res.tracks[index];
            player.queue.add(track);

            if (!player.playing && !player.paused) {
                player.play();
            }
            else {
                client.embed({
                    title: `${client.emotes.normal.music}・${track.title}`,
                    url: track.uri,
                    descKey: 'music.songQueued',
                    thumbnail: track.thumbnail,
                    fields: [
                        {
                            name: `👤┆Requested By`,
                            value: `${track.requester}`,
                            inline: true
                        },
                        {
                            name: `${client.emotes.normal.clock}┆Ends at`,
                            value: `<t:${((Date.now() / 1000) + (track.length / 1000)).toFixed(0)}:f>`,
                            inline: true
                        },
                        {
                            name: `🎬┆Author`,
                            value: `${track.author}`,
                            inline: true
                        }
                    ],
                    type: 'editreply'
                }, interaction)
            }
        }
    }
}

