const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notepad')
        .setDescription(getCommandMetadata('commandMetadata.notepad.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.add.description'))
                .addStringOption(option => option.setName('note').setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.add.options.note.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.delete.description'))
                .addStringOption(option => option.setName('id').setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.delete.options.id.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.edit.description'))
                .addStringOption(option => option.setName('id').setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.edit.options.id.description')).setRequired(true))
                .addStringOption(option => option.setName('note').setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.edit.options.note.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('notes')
                .setDescription(getCommandMetadata('commandMetadata.notepad.subcommands.notes.description'))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.notepad',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
