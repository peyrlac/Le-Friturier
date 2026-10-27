const Discord = require('discord.js');

const Schema = require("../../database/models/notes");

module.exports = async (client, interaction, args) => {
    let id = interaction.options.getString('id');
    let note = interaction.options.getString('note');

    const data = await Schema.findOne({ Guild: interaction.guild.id, Code: id });
    if (!data) return client.errNormal({ key: 'notes.notFound', type: 'editreply' }, interaction);

    data.Note = note;
    await data.save();
    return client.succNormal({ key: 'notes.edited', type: 'editreply' }, interaction);
}

