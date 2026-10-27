const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const word = interaction.options.getString('word');

    return getJson(`http://www.anagramica.com/all/${encodeURIComponent(word)}`)
        .then(async (json) => {
            let content = ``;
            if (!json.all[0]) return client.errNormal({ key: 'tools.noWordFound', type: 'editreply' }, interaction)

            json.all.forEach(i => {
                content += `${i}\n`;
            });

            client.embed({
                titleKey: 'tools.anagramTitle',
                descKey: 'tools.anagramDescription',
                fields: [
                    {
                        name: `${await client.t(interaction, 'tools.words')}`,
                        value: content
                    }
                ],
                type: 'editreply'
            }, interaction)
        }).catch(() => client.errNormal({ key: 'tools.remoteDataError', type: 'editreply' }, interaction))

}


