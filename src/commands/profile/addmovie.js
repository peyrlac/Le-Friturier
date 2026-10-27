const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const movie = interaction.options.getString('movie');

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Movies) {
                if (data.Movies.includes(movie)) {
                    return client.errNormal({ key: 'profile.itemAlreadyExists', variables: { item: movie }, type: 'editreply' }, interaction);
                }
                data.Movies.push(movie);
                await data.save();
            }
            else {
                data.Movies = [movie];
                await data.save();
            }
            return client.succNormal({
                key: 'profile.itemAdded',
                variables: { item: movie },
                fields: [{
                    name: await client.t(interaction, 'profile.fields.movies'),
                    value: `\`\`\`${movie}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

