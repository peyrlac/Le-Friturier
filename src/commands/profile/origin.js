const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const country = interaction.options.getString('country');

    if (country.length > 50) return client.errNormal({ key: 'profile.originTooLong', type: 'editreply' }, interaction);

    Schema.findOne({ User: interaction.user.id }, async (err, data) => {
        if (data) {
            data.Orgin = country;
            data.save();

            client.succNormal({
                key: 'profile.originSuccess',
                variables: { country },
                fields: [{
                    name: "🌍┆Country",
                    value: `\`\`\`${country}\`\`\``,
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

