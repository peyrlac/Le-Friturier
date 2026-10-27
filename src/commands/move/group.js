const { PermissionsBitField, ChannelType } = require('discord.js');

// Move members of a role from a voice channel to another voice channel
module.exports = async (client, interaction) => {
    const inputStartChannel = interaction.options.getChannel('from');
    const endChannel = interaction.options.getChannel('to');
    const moveLive = interaction.options.getBoolean('exclude_streamers');
    const role = interaction.options.getRole('role');

    const startChannel = inputStartChannel || interaction.member.voice.channel;

    if (!startChannel) {
        return client.errNormal({
            key: 'move.noStart',
            type: 'editreply'
        }, interaction);
    }

    if (startChannel.id === endChannel.id) {
        return client.errNormal({
            key: 'move.sameChannel',
            type: 'editreply'
        }, interaction);
    }

    if (
        startChannel.type !== ChannelType.GuildVoice ||
        endChannel.type !== ChannelType.GuildVoice
    ) {
        return client.errNormal({
            key: 'move.invalidChannels',
            type: 'editreply'
        }, interaction);
    }

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
        return client.errNormal({
            key: 'move.movePermission',
            type: 'editreply'
        }, interaction);
    }

    const membersToMove = [...startChannel.members.values()].filter(member =>
        member.roles.cache.has(role.id) && (!moveLive || !member.voice.streaming)
    );

    if (membersToMove.length === 0) {
        return client.errNormal({
            key: 'move.noMembersCriteria',
            type: 'editreply'
        }, interaction);
    }

    const movePromises = membersToMove.map(member =>
        member.voice.setChannel(endChannel, `Moved by ${interaction.user.tag} via /move group`)
            .then(() => true)
            .catch(err => {
                console.error(`Error moving ${member.user.tag}:`, err);
                return false;
            })
    );

    const results = await Promise.all(movePromises);
    const movedCount = results.filter(Boolean).length;

    return client.succNormal({
        key: 'move.moved',
        variables: { count: movedCount, from: startChannel.name, to: endChannel.name },
        type: 'editreply'
    }, interaction);
};
