const discord = require('discord.js');

/**
 * @param {discord.Client} client 
 * @param {discord.GuildMember} user 
 * @param {discord.User} mod 
 * @param {string} reason 
 * @returns
 */
module.exports = async (client, user, mod, reason) => {
    const logsChannel = await client.getLogs(user.guild.id);
    if (!logsChannel) return;

    client.embed({
        title: await client.t(user, 'moderationEvents.warnTitle'),
        desc: await client.t(user, 'moderationEvents.warnDescription'),
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
            },
            {
                name: await client.t(user, 'moderationEvents.reason'),
                value: `${reason}`
            }
        ]
    }, logsChannel).catch(() => {
        console.log
     })
};
