const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const song = interaction.options.getString('song');
    const user = { User: interaction.user.id }

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Songs) {
                if (!data.Songs.includes(song)) {
                    return client.errNormal({ key: 'profile.itemNotFound', variables: { item: song }, type: 'editreply' }, interaction);
                }

                const filtered = data.Songs.filter((target) => target !== song);

                await Schema.findOneAndUpdate(user, {
                    Songs: filtered
                });
            }
            return client.succNormal({
                key: 'profile.itemRemoved',
                variables: { item: song },
                fields: [{
                    name: "🎶┆Song",
                    value: `\`\`\`${song}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

