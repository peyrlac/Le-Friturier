const discord = require('discord.js');

module.exports = async (client, sticker) => {
    const logsChannel = await client.getLogs(sticker.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(sticker, 'auditEvents.stickerDeletedTitle'),
        desc: await client.t(sticker, 'auditEvents.stickerDeletedDescription'),
        fields: [
            {
                name: await client.t(sticker, 'auditEvents.name'),
                value: `- ${sticker.name}`
            },
            {
                name: await client.t(sticker, 'auditEvents.id'),
                value: `- ${sticker.id}`
            }
        ]
    }, logsChannel).catch(() => { })
};
