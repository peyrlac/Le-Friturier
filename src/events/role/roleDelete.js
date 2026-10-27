const discord = require('discord.js');

module.exports = async (client, role) => {
    const logsChannel = await client.getLogs(role.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(role, 'auditEvents.roleDeletedTitle'),
        desc: await client.t(role, 'auditEvents.roleDeletedDescription'),
        fields: [
            {
                name: await client.t(role, 'auditEvents.role'),
                value: `- ${role}`
            },
            {
                name: await client.t(role, 'auditEvents.name'),
                value: `- ${role.name}`
            },
            {
                name: await client.t(role, 'auditEvents.id'),
                value: `- ${role.id}`
            },
            {
                name: await client.t(role, 'auditEvents.color'),
                value: `${role.hexColor}`
            },
            {
                name: await client.t(role, 'auditEvents.position'),
                value: `${role.position}`
            },
            {
                name: await client.t(role, 'auditEvents.timestamp'),
                value: `- <t:${Math.floor(Date.now() / 1000)}:R>`
            }
        ]
    }, logsChannel).catch(() => { })
};
