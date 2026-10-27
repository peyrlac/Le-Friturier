const discord = require('discord.js');

module.exports = async (client, oldSticker, newSticker) => {
    const logsChannel = await client.getLogs(newSticker.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(newSticker, 'auditEvents.stickerUpdatedTitle'),
        desc: await client.t(newSticker, 'auditEvents.stickerUpdatedDescription'),
        fields: [
            {
                name: await client.t(newSticker, 'auditEvents.before'),
                value: `- ${oldSticker.name}`
            },
            {
                name: await client.t(newSticker, 'auditEvents.after'),
                value: `- ${newSticker.name}`
            },
            {
                name: await client.t(newSticker, 'auditEvents.id'),
                value: `- ${newSticker.id}`
            }
        ]
    }, logsChannel).catch(() => { })
};
