const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const food = interaction.options.getString('food');
    const user = { User: interaction.user.id }

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Food) {
                if (!data.Food.includes(food)) {
                    return client.errNormal({ key: 'profile.itemNotFound', variables: { item: food }, type: 'editreply' }, interaction);
                }

                const filtered = data.Food.filter((target) => target !== food);

                await Schema.findOneAndUpdate(user, {
                    Food: filtered
                });
            }
            return client.succNormal({
                key: 'profile.itemRemoved',
                variables: { item: food },
                fields: [{
                    name: "🥐┆Food",
                    value: `\`\`\`${food}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

