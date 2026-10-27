const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const status = interaction.options.getString('text');

    if (status.length > 30) return client.errNormal({ key: 'profile.statusTooLong', type: 'editreply' }, interaction);

    const data = await Schema.findOne({ User: interaction.user.id });
    if (data) {
            data.Status = status;
            await data.save();

            client.succNormal({
                key: 'profile.statusSuccess',
                variables: { status },
                fields: [{
                    name: await client.t(interaction, 'profile.fields.status'),
                    value: `\`\`\`${status}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
    } else {
        return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);
    }
}
