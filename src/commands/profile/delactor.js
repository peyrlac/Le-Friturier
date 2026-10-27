const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const actor = interaction.options.getString('actor');
    const user = { User: interaction.user.id }

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Actors) {
                if (!data.Actors.includes(actor)) {
                    return client.errNormal({ key: 'profile.itemNotFound', variables: { item: actor }, type: 'editreply' }, interaction);
                }

                const filtered = data.Actors.filter((target) => target !== actor);

                await Schema.findOneAndUpdate(user, {
                    Actors: filtered
                });
            }
            return client.succNormal({
                key: 'profile.itemRemoved',
                variables: { item: actor },
                fields: [{
                    name: "👨‍🎤┆Actor",
                    value: `\`\`\`${actor}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

