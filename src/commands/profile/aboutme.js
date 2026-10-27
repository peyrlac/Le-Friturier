const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const aboutme = interaction.options.getString('text');

    if (aboutme.length > 1024) return client.errNormal({ key: 'profile.aboutMeTooLong', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ User: interaction.user.id });
    if (data) {
            data.Aboutme = aboutme;
            await data.save();

            client.succNormal({
                key: 'profile.aboutMeSuccess',
                variables: { aboutme },
                fields: [{
                    name: "📘┆About Me",
                    value: `\`\`\`${aboutme}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
    } else {
        return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);
    }
}
