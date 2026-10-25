const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    return getJson(
        `https://some-random-api.com/img/panda`
    )

        .then(async (json) => {
            client.embed({
                title: `🐼・Random Panda`,
                image: json.link,
                type: 'editreply'
            }, interaction)
        }).catch(() => client.errNormal({ error: 'Unable to retrieve remote data.', type: 'editreply' }, interaction))
}


