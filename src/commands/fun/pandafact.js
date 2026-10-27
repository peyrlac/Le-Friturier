const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    return getJson(
        `https://some-random-api.com/facts/panda`
    )

        .then(async (json) => {
            client.embed({
                titleKey: 'fun.pandaFactTitle',
                desc: json.fact,
                type: 'editreply',
            }, interaction);
        }).catch(() => client.errNormal({ key: 'fun.remoteDataError', type: 'editreply' }, interaction))
}


