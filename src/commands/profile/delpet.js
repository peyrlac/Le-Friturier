const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const pet = interaction.options.getString('pet');
    const user = { User: interaction.user.id }

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Pets) {
                if (!data.Pets.includes(pet)) {
                    return client.errNormal({ key: 'profile.itemNotFound', variables: { item: pet }, type: 'editreply' }, interaction);
                }

                const filtered = data.Pets.filter((target) => target !== pet);

                await Schema.findOneAndUpdate(user, {
                    Pets: filtered
                });
            }
            return client.succNormal({
                key: 'profile.itemRemoved',
                variables: { item: pet },
                fields: [{
                    name: await client.t(interaction, 'profile.fields.pets'),
                    value: `\`\`\`${pet}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

