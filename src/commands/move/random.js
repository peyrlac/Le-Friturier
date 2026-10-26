const { PermissionsBitField, ChannelType } = require('discord.js');

// Move a random number of members from a voice channel to another voice channel
module.exports = async (client, interaction) => {
    const inputStartChannel = interaction.options.getChannel('from');
    const endChannel = interaction.options.getChannel('to');
    const moveLive = interaction.options.getBoolean('exclude_streamers');
    const amount = interaction.options.getInteger('amount');

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

    const eligibleMembers = [...startChannel.members.values()].filter(member =>
        !member.user.bot && (moveLive ? !member.voice.streaming : true)
    );

    if (eligibleMembers.length === 0) {
        return client.errNormal({
            key: 'move.noMembersCriteria',
            type: 'editreply'
        }, interaction);
    }

    if (eligibleMembers.length < amount) {
        return client.errNormal({
            key: 'move.insufficient',
            variables: { available: eligibleMembers.length, requested: amount },
            type: 'editreply'
        }, interaction);
    }

    const selectedMembers = eligibleMembers
        .sort(() => Math.random() - 0.5)
        .slice(0, amount);

    const movePromises = selectedMembers.map(member =>
        member.voice.setChannel(endChannel, `Random move by ${interaction.user.tag}`)
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
