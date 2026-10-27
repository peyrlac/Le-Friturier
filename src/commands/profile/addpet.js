const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const pet = interaction.options.getString('pet');

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Pets) {
                if (data.Pets.includes(pet)) {
                    return client.errNormal({ key: 'profile.itemAlreadyExists', variables: { item: pet }, type: 'editreply' }, interaction);
                }
                data.Pets.push(pet);
                await data.save();
            }
            else {
                data.Pets = [pet];
                await data.save();
            }
            return client.succNormal({
                key: 'profile.itemAdded',
                variables: { item: pet },
                fields: [{
                    name: await client.t(interaction, 'profile.fields.pets'),
                    value: `\`\`\`${pet}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

