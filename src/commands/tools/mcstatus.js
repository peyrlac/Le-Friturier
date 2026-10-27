const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const ip = interaction.options.getString('ip');

    if (ip == null) return client.errUsage({ usage: "mcstatus [ip]", type: 'editreply' }, interaction)

    return getJson(`https://api.mcsrvstat.us/2/${ip}`)

        .then(async (json) => {

            if (!json.players) return client.errNormal({ key: 'tools.serverNotFound', type: 'editreply' }, interaction)

            return client.embed({
                title: await client.t(interaction, 'tools.serverTitle', { ip }),
                thumbnail: `https://eu.mc-api.net/v3/server/favicon/${ip}`,
                fields: [{
                    name: await client.t(interaction, 'tools.online'),
                    value: `${json.online}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'tools.version'),
                    value: `${json.version}`,
                    inline: true,
                },
                {
                    name: await client.t(interaction, 'tools.playersOnline'),
                    value: `${json.players.online}/${json.players.max}`,
                    inline: true,
                },
                ], type: 'editreply'
            }, interaction)
        }).catch(() => client.errNormal({ key: 'tools.remoteDataUnavailable', type: 'editreply' }, interaction))
}


