const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const user = interaction.options.getUser('user');
    const url = 'https://some-random-api.com/animu/hug';

    if (!user) return client.errUsage({ usage: "hug [mention user]", type: 'editreply' }, interaction);

    let response, data;
    try {
        data = await getJson(url);
    } catch (e) {
        return client.errNormal({ key: 'errors.generic', type: 'editreply' }, interaction);
    }

    client.embed({
        titleKey: 'fun.hugTitle',
        variables: { from: interaction.user.tag, to: user.tag },
        image: `${data.link}`,
        type: 'editreply'
    }, interaction);
}


