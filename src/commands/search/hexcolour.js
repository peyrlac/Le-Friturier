const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const color = interaction.options.getString('color');

    const data = await getJson(
        `https://some-random-api.com/canvas/rgb?hex=${color}`
    ).catch(e => {
        return client.errNormal({ 
            key: 'search.colorNotFound',
            type: 'editreply'
        }, interaction)
    });

    if (!data) return;

    client.embed({
        titleKey: 'search.colorTitle',
        image: `https://some-random-api.com/canvas/colorviewer?hex=${color}`,
        color: `#${color}`,
        fields: [
            {
                name: await client.t(interaction, 'search.hex'),
                value: `#${color}`,
                inline: true,
            },
            {
                name: await client.t(interaction, 'search.rgb'),
                value: `${data.r}, ${data.g}, ${data.b}`,
                inline: true,
            }
        ],
        type: 'editreply'
    }, interaction)
}

 
