const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = async (client, interaction, args) => {
    const duration = moment.duration(client.uptime).format("\`D\` [days], \`H\` [hrs], \`m\` [mins], \`s\` [secs]");
    const upvalue = (Date.now() / 1000 - client.uptime / 1000).toFixed(0);

    client.embed({
        title: await client.t(interaction, 'botResponses.uptimeTitle', { arrow: client.emotes.normal.arrowUp }),
        desc: await client.t(interaction, 'botResponses.uptimeDescription'),
        fields: [
            {
                name: await client.t(interaction, 'botResponses.uptimeDuration'),
                value: `${duration}`,
                inline: true
            },
            {
                name: await client.t(interaction, 'botResponses.uptimeSince'),
                value: `<t:${upvalue}>`,
                inline: true
            }
        ],
        type: 'editreply'
    }, interaction)
}
