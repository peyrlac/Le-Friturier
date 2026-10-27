const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const user = interaction.user.username;
    const text = interaction.options.getString('text');

    try {
        await getJson(`https://nekobot.xyz/api/imagegen?type=tweet&username=${encodeURIComponent(user)}&text=${encodeURIComponent(text)}`)


            .then(async (json) => {

                client.embed({
                    title: `🖼・Tweet`,
                    image: json.message,
                    type: 'editreply'
                }, interaction)

            }).catch(() => client.errNormal({ error: 'Unable to retrieve remote data.', type: 'editreply' }, interaction))
    } catch (error) {
        return client.errNormal({ error: 'Unable to generate the tweet image.', type: 'editreply' }, interaction);
    }

}


