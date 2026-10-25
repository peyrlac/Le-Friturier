const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const age = interaction.options.getNumber('number');

    const data = await Schema.findOne({ User: interaction.user.id });
    if (data) {
            if (isNaN(age)) return client.errNormal({ key: 'profile.invalidAge', type: 'editreply' }, interaction)

            data.Age = age;
            await data.save();

            client.succNormal({
                key: 'profile.ageSuccess',
                variables: { age },
                fields: [{
                    name: "📆┆Age",
                    value: `\`\`\`${age}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
    } else {
        return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);
    }
}
