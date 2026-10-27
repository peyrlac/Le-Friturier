const thanksSchema = require("../../database/models/thanks");

module.exports = async (client, interaction, args) => {

    const member = interaction.options.getUser('user');

    const data = await thanksSchema.findOne({ User: member.id });
    if (data) {
        return client.embed({ title: `🤝・Thanks`, desc: `**${member.tag}** has \`${data.Received}\` thanks`, type: 'editreply' }, interaction);
    }

    return client.embed({ title: `🤝・Thanks`, desc: `**${member.tag}** has \`0\` thanks`, type: 'editreply' }, interaction);

}


