const Schema = require("../../database/models/reminder");
const ms = require("ms");

module.exports = async (client, interaction, args) => {
    const time = interaction.options.getString('time');
    const text = interaction.options.getString('message');
    const endtime = Date.now() + ms(time);

    const data = await Schema.findOne({ Text: text, User: interaction.user.id, endTime: endtime });
    if (data) {
        return client.errNormal({ key: 'tools.reminderExists', type: 'editreply' }, interaction);
    }

    await new Schema({ Text: text, User: interaction.user.id, endTime: endtime }).save();
    await client.succNormal({
        key: 'tools.reminderSet',
        fields: [
            { name: `${client.emotes.normal.clock}${await client.t(interaction, 'tools.reminderEndTime')}`, value: new Date(endtime).toLocaleTimeString(), inline: true },
            { name: await client.t(interaction, 'tools.reminder'), value: text, inline: true }
        ],
        type: 'editreply'
    }, interaction);

    setTimeout(async () => {
        try {
            await client.embed({
                title: await client.t(interaction, 'tools.reminderEnded'),
                desc: await client.t(interaction, 'tools.reminderEndedDescription'),
                fields: [{ name: await client.t(interaction, 'tools.reminder'), value: text, inline: true }]
            }, interaction.user);
            await Schema.findOneAndDelete({ Text: text, User: interaction.user.id, endTime: endtime });
        }
        catch (error) {
            console.error(error);
        }
    }, Math.max(0, endtime - Date.now()));
};
