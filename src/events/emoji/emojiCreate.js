const discord = require('discord.js');

module.exports = async (client, emoji) => {
    const logsChannel = await client.getLogs(emoji.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(emoji, 'auditEvents.emojiCreatedTitle'),
        desc: await client.t(emoji, 'auditEvents.emojiCreatedDescription'),
        fields: [
            {
                name: await client.t(emoji, 'auditEvents.emoji'),
                value: `- ${emoji}`
            },
            {
                name: await client.t(emoji, 'auditEvents.name'),
                value: `- ${emoji.name}`
            },
            {
                name: await client.t(emoji, 'auditEvents.id'),
                value: `- ${emoji.id}`
            },
            {
                name: await client.t(emoji, 'auditEvents.url'),
                value: `- ${emoji.url}`
            }
        ]
    }, logsChannel).catch(() => { })
};
