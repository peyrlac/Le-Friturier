const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const movie = interaction.options.getString('movie');
    const user = { User: interaction.user.id }

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Movies) {
                if (!data.Movies.includes(movie)) {
                    return client.errNormal({ key: 'profile.itemNotFound', variables: { item: movie }, type: 'editreply' }, interaction);
                }

                const filtered = data.Movies.filter((target) => target !== movie);

                await Schema.findOneAndUpdate(user, {
                    Movies: filtered
                });
            }
            return client.succNormal({
                key: 'profile.itemRemoved',
                variables: { item: movie },
                fields: [{
                    name: "🎬┆Movies",
                    value: `\`\`\`${movie}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

