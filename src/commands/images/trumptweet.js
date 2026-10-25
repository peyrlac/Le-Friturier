const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    let tweet = interaction.options.getString('text');

    if (tweet.length > 68) tweet = tweet.slice(0, 65) + "...";

    try {
    const json = await getJson(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${encodeURIComponent(tweet)}`);

    const img = json.message;

    client.embed({
        title: `🖼・Trump tweet`,
        image: img,
        type: 'editreply'
    }, interaction);
    } catch (error) {
        return client.errNormal({ error: 'Unable to generate the tweet image.', type: 'editreply' }, interaction);
    }
}


