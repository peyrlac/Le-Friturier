const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const artist = interaction.options.getString('artist');
    const user = { User: interaction.user.id }

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Artists) {
                if (!data.Artists.includes(artist)) {
                    return client.errNormal({ key: 'profile.itemNotFound', variables: { item: artist }, type: 'editreply' }, interaction);
                }

                const filtered = data.Artists.filter((target) => target !== artist);

                await Schema.findOneAndUpdate(user, {
                    Artists: filtered
                });
            }
            return client.succNormal({
                key: 'profile.itemRemoved',
                variables: { item: artist },
                fields: [{
                    name: "🎤┆Artist",
                    value: `\`\`\`${artist}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

