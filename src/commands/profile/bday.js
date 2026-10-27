const Schema = require('../../database/models/profile');

module.exports = async (client, interaction, args) => {
    const joined = interaction.options.getString('bday', true);
    const split = joined.trim().split("/");

    let [day, month] = split;

    if (!day || !month) return client.errUsage({ usage: await client.t(interaction, 'profile.bdayUsage'), type: 'editreply' }, interaction);

    if (isNaN(day) || isNaN(month)) {
        return client.errNormal({ key: 'profile.bdayInvalidNumber', type: 'editreply' }, interaction);
    }

    day = parseInt(day);
    month = parseInt(month);

    if (!day || day < 1 || day > 31) return client.errNormal({ key: 'profile.bdayInvalidDay', type: 'editreply' }, interaction);
    if (!month || month < 1 || month > 12) return client.errNormal({ key: 'profile.bdayInvalidMonth', type: 'editreply' }, interaction);

    const bday = `${day}/${month}`;

    const data = await Schema.findOne({ User: interaction.user.id });
    if (!data) return client.errNormal({ key: 'profile.notFound', type: 'editreply' }, interaction);

    data.Birthday = bday;
    await data.save();

    return client.succNormal({
        key: 'profile.bdaySuccess',
        variables: { bday },
        fields: [{
            name: await client.t(interaction, 'profile.bdayField'),
            value: `\`\`\`${bday}\`\`\``,
            inline: true,
        }],
        type: 'editreply'
    }, interaction);
}

