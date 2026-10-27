const Discord = require('discord.js');
const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    return getJson(
        `https://some-random-api.com/bottoken?id=${interaction.user.id}`
    )

        .then(async (json) => {

            client.embed({
                title: `🤖・Bot token`,
                desc: json.token,
                type: 'editreply',
            }, interaction);
        }).catch(() => client.errNormal({ error: 'Unable to retrieve remote data.', type: 'editreply' }, interaction))

}


