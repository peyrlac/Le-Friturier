const { getJson } = require('../../handlers/http');

module.exports = async (client, interaction, args) => {

    const color = interaction.options.getString('color');

    const data = await getJson(
        `https://some-random-api.com/canvas/rgb?hex=${color}`
    ).catch(e => {
        return client.errNormal({ 
            error: "Color not found!",
            type: 'editreply'
        }, interaction)
    });

    if (!data) return;

    client.embed({
        title: `🎨・Color info`,
        image: `https://some-random-api.com/canvas/colorviewer?hex=${color}`,
        color: `#${color}`,
        fields: [
            {
                name: "Hex",
                value: `#${color}`,
                inline: true,
            },
            {
                name: "RGB",
                value: `${data.r}, ${data.g}, ${data.b}`,
                inline: true,
            }
        ],
        type: 'editreply'
    }, interaction)
}

 
