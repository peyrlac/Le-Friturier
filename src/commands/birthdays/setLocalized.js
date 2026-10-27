const Schema = require('../../database/models/birthday');

const suffixes = number => {
    const value = String(number);
    const last = value.charAt(value.length - 1);
    return last === '1' ? `${value}st` : last === '2' ? `${value}nd` : last === '3' ? `${value}rd` : `${value}th`;
};

module.exports = async (client, interaction) => {
    const day = interaction.options.getNumber('day');
    const month = interaction.options.getNumber('month');
    if (!day || day > 31) return client.errNormal({ key: 'birthdays.invalidDay', type: 'editreply' }, interaction);
    if (!month || month > 12) return client.errNormal({ key: 'birthdays.invalidMonth', type: 'editreply' }, interaction);

    const monthName = await client.t(interaction, `birthdays.months.${month}`);
    const birthday = `${suffixes(day)} ${await client.t(interaction, 'birthdays.of')} ${monthName}`;
    const data = await Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
    if (data) {
        data.Birthday = birthday;
        await data.save();
    } else {
        await new Schema({ Guild: interaction.guild.id, User: interaction.user.id, Birthday: birthday }).save();
    }

    return client.succNormal({ key: 'birthdays.setSuccess', variables: { birthday }, fields: [{ name: await client.t(interaction, 'birthdays.field'), value: birthday }], type: 'editreply' }, interaction);
};
