const Discord = require('discord.js');
const generator = require('generate-password');

const Schema = require("../../database/models/notes");

module.exports = async (client, interaction, args) => {

    let id = interaction.options.getString('id');

    const data = await Schema.findOne({ Guild: interaction.guild.id, Code: id });
    if (!data) return client.errNormal({ key: 'notes.deleteNotFound', variables: { id }, type: 'editreply' }, interaction);

    await Schema.findOneAndDelete({ Guild: interaction.guild.id, Code: id });
    return client.succNormal({ key: 'notes.deleted', variables: { id }, type: 'editreply' }, interaction);
}

