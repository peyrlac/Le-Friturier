const Schema = require("../../database/models/reminder");
const ms = require("ms");

module.exports = async (client, interaction, args) => {
    const time = interaction.options.getString('time');
    const text = interaction.options.getString('message');
    const endtime = Date.now() + ms(time);

    const data = await Schema.findOne({ Text: text, User: interaction.user.id, endTime: endtime });
    if (data) {
        return client.errNormal({ error: 'You already made this reminder!', type: 'editreply' }, interaction);
    }

    await new Schema({ Text: text, User: interaction.user.id, endTime: endtime }).save();
    await client.succNormal({
        text: 'Your reminder is set!',
        fields: [
            { name: `${client.emotes.normal.clock}‡End Time`, value: new Date(endtime).toLocaleTimeString(), inline: true },
            { name: '💭‡Reminder', value: text, inline: true }
        ],
        type: 'editreply'
    }, interaction);

    setTimeout(async () => {
        try {
            await client.embed({
                title: '🔔・Reminder',
                desc: 'Your reminder just ended!',
                fields: [{ name: '💭‡Reminder', value: text, inline: true }]
            }, interaction.user);
            await Schema.findOneAndDelete({ Text: text, User: interaction.user.id, endTime: endtime });
        }
        catch (error) {
            console.error(error);
        }
    }, Math.max(0, endtime - Date.now()));
};
