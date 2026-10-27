const Schema = require("../../database/models/reactionRoles");

module.exports = async (client, interaction, args) => {
    const category = interaction.options.getString('category');

    const data = await Schema.findOne({ Guild: interaction.guild.id, Category: category });
    if (!data) return client.errNormal({
        key: 'reactionroles.noData',
        type: 'editreply'
    }, interaction);

    await Schema.deleteOne({ Guild: interaction.guild.id, Category: category });

    return client.succNormal({
        key: 'reactionroles.deleted',
        variables: { category },
        type: 'editreply'
    }, interaction);
}


