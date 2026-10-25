const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const user = interaction.user.username;
    const text = interaction.options.getString('text');

    try {
        await getJson(`https://nekobot.xyz/api/imagegen?type=tweet&username=${encodeURIComponent(user)}&text=${encodeURIComponent(text)}`)


            .then(async (json) => {

                client.embed({
                    titleKey: 'images.tweetTitle',
                    image: json.message,
                    type: 'editreply'
                }, interaction)

            }).catch(() => client.errNormal({ key: 'images.remoteDataError', type: 'editreply' }, interaction))
    } catch (error) {
        return client.errNormal({ key: 'images.generateError', type: 'editreply' }, interaction);
    }

}


