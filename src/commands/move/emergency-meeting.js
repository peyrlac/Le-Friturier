const { PermissionsBitField, ChannelType } = require('discord.js');

// Move all members from every voice channel to another voice channel
module.exports = async (client, interaction) => {
    const endChannel = interaction.options.getChannel('to');
    const moveLive = interaction.options.getBoolean('exclude_streamers');
    const excludedChannel = interaction.options.getChannel('excepted_channel');

    // Vérification permission correcte
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return client.errNormal({
            key: 'move.managePermission',
            type: 'editreply'
        }, interaction);
    }

    const startChannels = interaction.guild.channels.cache.filter(channel =>
        channel.type === ChannelType.GuildVoice &&
        channel.id !== endChannel.id &&
        (!excludedChannel || channel.id !== excludedChannel.id)
    );

    if (!startChannels.size) {
        return client.errNormal({
            key: 'move.noEligibleChannels',
            type: 'editreply'
        }, interaction);
    }

    const membersToMove = [];

    for (const channel of startChannels.values()) {
        for (const member of channel.members.values()) {
            if (!moveLive || !member.voice.streaming) {
                membersToMove.push(member);
            }
        }
    }

    if (membersToMove.length === 0) {
        return client.errNormal({
            key: 'move.noMembersCriteria',
            type: 'editreply'
        }, interaction);
    }

    const movePromises = membersToMove.map(member =>
        member.voice.setChannel(endChannel, `Emergency meeting by ${interaction.user.tag}`)
            .then(() => true)
            .catch(err => {
                console.error(`Error moving ${member.user.tag}:`, err);
                return false;
            })
    );

    const results = await Promise.all(movePromises);
    const movedCount = results.filter(Boolean).length;

    return client.succNormal({
        key: 'move.emergency',
        variables: { count: movedCount, destination: endChannel.name },
        type: 'editreply'
    }, interaction);
};
