const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const actor = interaction.options.getString('actor');

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Actors) {
                if (data.Actors.includes(actor)) {
                    return client.errNormal({ key: 'profile.itemAlreadyExists', variables: { item: actor }, type: 'editreply' }, interaction);
                }
                data.Actors.push(actor);
                await data.save();
            }
            else {
                data.Actors = [actor];
                await data.save();
            }
            return client.succNormal({
                key: 'profile.itemAdded',
                variables: { item: actor },
                fields: [{
                    name: "👨‍🎤┆Actor",
                    value: `\`\`\`${actor}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

