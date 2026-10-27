const Schema = require('../../database/models/profile');
const isHexcolor = require('is-hexcolor');

module.exports = async (client, interaction, args) => {
    const color = interaction.options.getString('color', true);
    const data = await Schema.findOne({ User: interaction.user.id });

    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);
    if (!isHexcolor(color)) return client.errNormal({ key: 'profile.invalidColor', type: 'editreply' }, interaction);

    data.Color = color;
    await data.save();

    return client.succNormal({
        key: 'profile.colorSuccess',
        variables: { color },
        fields: [{
            name: await client.t(interaction, 'profile.colorField'),
            value: `\`\`\`${color}\`\`\``,
            inline: true,
        }],
        type: 'editreply'
    }, interaction);
}

