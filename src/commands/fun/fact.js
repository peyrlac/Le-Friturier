const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    var url = 'https://uselessfacts.jsph.pl/random.json?language=en'


    getJson(url).then((json) => {
        const fact = json.text;

        client.embed({
            titleKey: 'fun.factTitle',
            desc: fact,
            type: 'editreply',
        }, interaction);
    }).catch(() => client.errNormal({ key: 'fun.remoteDataError', type: 'editreply' }, interaction))
}


