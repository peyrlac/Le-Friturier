const discord = require('discord.js');

module.exports = async (client, role, oldColor, newColor) => {
    const logsChannel = await client.getLogs(role.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(role, 'auditEvents.roleColorUpdatedTitle'),
        desc: await client.t(role, 'auditEvents.roleUpdatedDescription'),
        fields: [
            {
                name: await client.t(role, 'auditEvents.role'),
                value: `- ${role}`
            },
            {
                name: await client.t(role, 'auditEvents.before'),
                value: `- #${oldColor.toString(16)}`
            },
            {
                name: await client.t(role, 'auditEvents.after'),
                value: `- #${newColor.toString(16)}`
            },
            {
                name: await client.t(role, 'auditEvents.id'),
                value: `${role.id}`
            },
            {
                name: await client.t(role, 'auditEvents.timestamp'),
                value: `- <t:${Math.floor(Date.now() / 1000)}:R>`
            }
        ]
    }, logsChannel).catch(() => { })
};
