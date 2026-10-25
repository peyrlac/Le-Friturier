const Schema = require('../../database/models/profile');
const isHexcolor = require('is-hexcolor');

module.exports = async (client, interaction, args) => {

    const color = interaction.options.getString('color');

    Schema.findOne({ User: interaction.user.id }, async (err, data) => {
        if (data) {
            if (!isHexcolor(color)) return client.errNormal({ key: 'profile.invalidColor', type: 'editreply' }, interaction);

            data.Color = color;
            data.save();

            client.succNormal({
                key: 'profile.colorSuccess',
                variables: { color },
                fields: [{
                    name: "🎨┆Color",
                    value: `\`\`\`${color}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
        }
        else {
            return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);
        }
    })
}

