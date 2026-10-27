const { PermissionsBitField, ChannelType } = require('discord.js');

// Move all members from a voice channel to another voice channel
module.exports = async (client, interaction) => {
    const inputStartChannel = interaction.options.getChannel('from');
    const endChannel = interaction.options.getChannel('to');
    const moveLive = interaction.options.getBoolean('exclude_streamers');
    const excludedUser = interaction.options.getUser('excepted_user');

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

    // Filtrage en fonction du paramètre `exclude_streamers`
    let membersToMove = [...startChannel.members.values()].filter(member =>
        moveLive ? !member.voice.streaming : true
    );

    // Filtrage en fonction de l'utilisateur exempté
    if (excludedUser) {
        membersToMove = membersToMove.filter(member => member.id !== excludedUser.id);
    }

    if (membersToMove.length === 0) {
        return client.errNormal({
            key: 'move.noMembersCriteria',
            type: 'editreply'
        }, interaction);
    }

    const movePromises = membersToMove.map(member =>
        member.voice.setChannel(endChannel, `Moved by ${interaction.user.tag} via /move all`).then(() => true).catch(err => {
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
