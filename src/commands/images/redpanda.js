const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    return getJson(
        `https://some-random-api.com/img/red_panda`
    )

        .then(async (json) => {
            client.embed({
                titleKey: 'images.redpandaTitle',
                image: json.link,
                type: 'editreply'
            }, interaction)
        }).catch(() => client.errNormal({ key: 'images.remoteDataError', type: 'editreply' }, interaction))
}


