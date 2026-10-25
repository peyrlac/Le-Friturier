const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const food = interaction.options.getString('food');

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Food) {
                if (data.Food.includes(food)) {
                    return client.errNormal({ key: 'profile.itemAlreadyExists', variables: { item: food }, type: 'editreply' }, interaction);
                }
                data.Food.push(food);
                await data.save();
            }
            else {
                data.Food = [food];
                await data.save();
            }
            return client.succNormal({
                key: 'profile.itemAdded',
                variables: { item: food },
                fields: [{
                    name: "🥐┆Food",
                    value: `\`\`\`${food}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

