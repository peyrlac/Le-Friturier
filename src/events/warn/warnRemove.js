const discord = require('discord.js');

module.exports = async (client, user, mod) => {
    const logsChannel = await client.getLogs(user.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(user, 'moderationEvents.unwarnTitle'),
        desc: await client.t(user, 'moderationEvents.unwarnDescription'),
        fields: [
            {
                name: await client.t(user, 'moderationEvents.user'),
                value: `- ${user}`
            },
            {
                name: await client.t(user, 'moderationEvents.tag'),
                value: `- ${user.user.username}#${user.user.discriminator}`
            },
            {
                name: await client.t(user, 'moderationEvents.id'),
                value: `${user.id}`
            },
            {
                name: await client.t(user, 'moderationEvents.moderator'),
                value: `${mod} (${mod.id})`
            }
        ]
    }, logsChannel).catch(() => { })
};
