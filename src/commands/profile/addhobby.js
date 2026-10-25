const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {

    const hobby = interaction.options.getString('hobby');

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

            if (data && data.Hobbys) {
                if (data.Hobbys.includes(hobby)) {
                    return client.errNormal({ key: 'profile.itemAlreadyExists', variables: { item: hobby }, type: 'editreply' }, interaction);
                }
                data.Hobbys.push(hobby);
                await data.save();
            }
            else {
                data.Hobbys = [hobby];
                await data.save();
            }
            return client.succNormal({
                key: 'profile.itemAdded',
                variables: { item: hobby },
                fields: [{
                    name: await client.t(interaction, 'profile.fields.hobbies'),
                    value: `\`\`\`${hobby}\`\`\``,
                    inline: true,
                }],
                type: 'editreply'
            }, interaction);
}

