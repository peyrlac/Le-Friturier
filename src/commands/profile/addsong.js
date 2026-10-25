const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const song = interaction.options.getString('song');

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Songs) {
                if (data.Songs.includes(song)) {
                    return client.errNormal({ key: 'profile.itemAlreadyExists', variables: { item: song }, type: 'editreply' }, interaction);
                }
                data.Songs.push(song);
                await data.save();
            }
            else {
                data.Songs = [song];
                await data.save();
            }
            return client.succNormal({
                key: 'profile.itemAdded',
                variables: { item: song },
                fields: [{
                    name: "🎶┆Song",
                    value: `\`\`\`${song}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

