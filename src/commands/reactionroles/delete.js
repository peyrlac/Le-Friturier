const Schema = require("../../database/models/reactionRoles");

module.exports = async (client, interaction, args) => {
    const category = interaction.options.getString('category');

    const data = await Schema.findOne({ Guild: interaction.guild.id, Category: category });
    if (!data) return client.errNormal({
        error: `No data found!`,
        type: 'editreply'
    }, interaction);

    await Schema.deleteOne({ Guild: interaction.guild.id, Category: category });

    return client.succNormal({
        text: `**${category}** successfully deleted!`,
        type: 'editreply'
    }, interaction);
}


