const Discord = require('discord.js');

module.exports = async (client, role, oldPerms, newPerms) => {

    const logsChannel = await client.getLogs(role.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(role, 'auditEvents.rolePermissionsUpdatedTitle'),
        desc: await client.t(role, 'auditEvents.roleUpdatedDescription'),
        fields: [
            {
                name: await client.t(role, 'auditEvents.role'),
                value: `- ${role}`
            },
            {
                name: await client.t(role, 'auditEvents.before'),
                value: `- ${new Discord.PermissionsBitField(oldPerms).toArray().toLocaleString().split(',').join(', ') || await client.t(role, 'auditEvents.none')}`
            },
            {
                name: await client.t(role, 'auditEvents.after'),
                value: `- ${new Discord.PermissionsBitField(newPerms).toArray().toLocaleString().split(',').join(', ') || await client.t(role, 'auditEvents.none')}`
            },
            {
                name: await client.t(role, 'auditEvents.id'),
                value: `${role.id}`
            },
            {
                name: await client.t(role, 'auditEvents.timestamp'),
                value: `<t:${Math.floor(Date.now() / 1000)}:R>`
            }
        ]
    }, logsChannel).catch(() => { })
};
