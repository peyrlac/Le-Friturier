const Schema = require("../../database/models/customCommandAdvanced");

module.exports = async (client, interaction, args) => {
    const name = interaction.options.getString('command').toLowerCase();
    const existing = await Schema.findOne({ Guild: interaction.guild.id, Name: name });
    if (!existing) {
        return client.errNormal({ key: 'customCommands.notFound', type: 'editreply' }, interaction);
    }

    await Schema.findOneAndDelete({ Guild: interaction.guild.id, Name: name });
    const commands = await interaction.guild.commands.fetch();
    const command = commands.find(item => item.name === name);
    if (!command) {
        return client.errNormal({ key: 'customCommands.notFound', type: 'editreply' }, interaction);
    }

    await interaction.guild.commands.delete(command.id);
    return client.succNormal({
        key: 'customCommands.removed',
        fields: [{ name: '🔧・Commande', value: `\`\`\`${name}\`\`\``, inline: true }],
        type: 'editreply'
    }, interaction);
};
