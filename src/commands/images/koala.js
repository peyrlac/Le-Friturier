const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    return getJson(
        `https://some-random-api.com/img/koala`
    )

        .then(async (json) => {
            client.embed({
                titleKey: 'images.koalaTitle',
                image: json.link,
                type: 'editreply'
            }, interaction)
        }).catch(() => client.errNormal({ key: 'images.remoteDataError', type: 'editreply' }, interaction))
}


