const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {
    const country = interaction.options.getString('country', true);
    if (country.length > 50) return client.errNormal({ key: 'profile.originTooLong', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

    data.Orgin = country;
    await data.save();

    return client.succNormal({
        key: 'profile.originSuccess',
        variables: { country },
        fields: [{
            name: await client.t(interaction, 'profile.originField'),
            value: `\`\`\`${country}\`\`\``,
            inline: true,
        }],
        type: 'editreply'
    }, interaction);
}

