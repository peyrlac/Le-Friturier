const discord = require('discord.js');

module.exports = async (client, emoji) => {
    const logsChannel = await client.getLogs(emoji.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(emoji, 'auditEvents.emojiDeletedTitle'),
        desc: await client.t(emoji, 'auditEvents.emojiDeletedDescription'),
        fields: [
            {
                name: await client.t(emoji, 'auditEvents.name'),
                value: `- ${emoji.name}`
            },
            {
                name: await client.t(emoji, 'auditEvents.id'),
                value: `- ${emoji.id}`
            }
        ]
    }, logsChannel).catch(() => { })
};
