const Discord = require('discord.js');
const generator = require('generate-password');

const Schema = require("../../database/models/notes");

module.exports = async (client, interaction, args) => {

    const code = generator.generate({
        length: 4,
        lowercase: false,
        uppercase: false,
        numbers: true
    });

    let note = interaction.options.getString('note');

    const data = await Schema.findOne({ Guild: interaction.guild.id, Code: code });
    if (data) return client.errNormal({ key: 'notes.codeCollision', type: 'editreply' }, interaction);

    await new Schema({
        Guild: interaction.guild.id,
        User: interaction.user.id,
        Code: code,
        Note: note
    }).save();
    return client.succNormal({ key: 'notes.added', type: 'editreply' }, interaction);
}

