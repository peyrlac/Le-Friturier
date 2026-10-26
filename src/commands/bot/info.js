const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = async (client, interaction, args) => {
    const promises = [
        client.shard.broadcastEval(client => client.guilds.cache.size),
        client.shard.broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        client.shard.broadcastEval(client => client.channels.cache.size),
        client.shard.broadcastEval(client => client.voice.adapters.size)
    ];
    return Promise.all(promises)
        .then(async results => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
            const totalChannels = results[2].reduce((acc, channelCount) => acc + channelCount, 0);
            const totalVoice = results[3].reduce((acc, voiceCount) => acc + voiceCount, 0);

            const duration = moment.duration(client.uptime).format("\`D\` [days], \`H\` [hrs], \`m\` [mins], \`s\` [secs]");

            client.embed({
                title: await client.t(interaction, 'botInfo.title'),
                desc: await client.t(interaction, 'botInfo.description'),
                thumbnail: client.user.avatarURL({ size: 1024 }),
                fields: [
               {
                    name: await client.t(interaction, 'botInfo.information'),
                    value: await client.t(interaction, 'botInfo.informationValue'),
                    inline: false,
                },
                {
                    name: await client.t(interaction, 'botInfo.general'),
                    value: `_____`,
                    inline: false,
                },
                {
                    name: await client.t(interaction, 'botInfo.botName'),
                    value: `${client.user.username}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.botId'),
                    value: `${client.user.id}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.shards'),
                    value: await client.t(interaction, 'botInfo.shardsValue', { count: client.options.shardCount }),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.owner'),
                    value: `<@!755297485328482356> `,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.developer'),
                    value: `<@!755297485328482356> <@!884553151666061372>`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.commands'),
                    value: await client.t(interaction, 'botInfo.commandsValue', { count: client.commands.size }),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.guilds'),
                    value: await client.t(interaction, 'botInfo.guildsValue', { count: totalGuilds }),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.currentGuilds'),
                    value: await client.t(interaction, 'botInfo.guildsValue', { count: client.guilds.cache.size }),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.members'),
                    value: await client.t(interaction, 'botInfo.membersValue', { count: totalMembers }),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.voiceChannels'),
                    value: await client.t(interaction, 'botInfo.channelsValue', { count: totalVoice }),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.channels'),
                    value: await client.t(interaction, 'botInfo.channelsValue', { count: totalChannels }),
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.createdAt'),
                    value: `<t:${Math.round(client.user.createdTimestamp / 1000)}>`,
                    inline: true,
                },

                {
                    name: await client.t(interaction, 'botInfo.system'),
                    value: `_____`,
                    inline: false,
                },
                {
                    name: await client.t(interaction, 'botInfo.uptime'),
                    value: `${duration}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.apiLatency'),
                    value: `\`${client.ws.ping}\`ms`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.botVersion'),
                    value: `\`${require(`${process.cwd()}/package.json`).version}\``,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.nodeVersion'),
                    value: `\`${process.version}\``,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.discordVersion'),
                    value: `\`${Discord.version}\``,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.memory'),
                    value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}\` MB`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'botInfo.links'),
                    value: await client.t(interaction, 'botInfo.linksValue', { botInvite: client.config.discord.botInvite, serverInvite: client.config.discord.serverInvite }),
                    inline: false,
                }],
                type: 'editreply'
            }, interaction)
        })
}

 
