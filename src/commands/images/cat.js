const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    return getJson(
        `https://some-random-api.com/img/cat`
    )

        .then(async (json) => {
            client.embed({
                title: `🐱・Random Cat`,
                image: json.link,
                type: 'editreply'
            }, interaction)
        }).catch(() => client.errNormal({ error: 'Unable to retrieve remote data.', type: 'editreply' }, interaction))
}


