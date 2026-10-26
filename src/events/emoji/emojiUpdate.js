const discord = require('discord.js');

module.exports = async (client, oldEmoji, newEmoji) => {
    const logsChannel = await client.getLogs(newEmoji.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(newEmoji, 'auditEvents.emojiUpdatedTitle'),
        desc: await client.t(newEmoji, 'auditEvents.emojiUpdatedDescription'),
        fields: [
            {
                name: await client.t(newEmoji, 'auditEvents.emoji'),
                value: `- ${newEmoji}`
            },
            {
                name: await client.t(newEmoji, 'auditEvents.before'),
                value: `- ${oldEmoji.name}`
            },
            {
                name: await client.t(newEmoji, 'auditEvents.after'),
                value: `- ${newEmoji.name}`
            },
            {
                name: await client.t(newEmoji, 'auditEvents.id'),
                value: `- ${newEmoji.id}`
            }
        ]
    }, logsChannel).catch(() => { })
};
