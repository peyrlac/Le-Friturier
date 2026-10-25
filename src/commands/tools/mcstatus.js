const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const ip = interaction.options.getString('ip');

    if (ip == null) return client.errUsage({ usage: "mcstatus [ip]", type: 'editreply' }, interaction)

    return getJson(`https://api.mcsrvstat.us/2/${ip}`)

        .then(async (json) => {

            if (!json.players) return client.errNormal({ error: "Can't find the server!", type: 'editreply' }, interaction)

            return client.embed({
                title: `📁・${ip}`,
                thumbnail: `https://eu.mc-api.net/v3/server/favicon/${ip}`,
                fields: [{
                    name: "🟢┇Online",
                    value: `${json.online}`,
                    inline: true,
                },
                {
                    name: "🏷️┇Version",
                    value: `${json.version}`,
                    inline: true,
                },
                {
                    name: "👤┇Players online",
                    value: `${json.players.online}/${json.players.max}`,
                    inline: true,
                },
                ], type: 'editreply'
            }, interaction)
        }).catch(() => client.errNormal({ error: 'Unable to retrieve remote data.', type: 'editreply' }, interaction))
}


