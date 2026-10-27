const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestions')
        .setDescription(getCommandMetadata('commandMetadata.suggestions.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.suggestions.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('accept')
                .setDescription(getCommandMetadata('commandMetadata.suggestions.subcommands.accept.description'))
                .addStringOption(option => option.setName('id').setDescription(getCommandMetadata('commandMetadata.suggestions.subcommands.accept.options.id.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deny')
                .setDescription(getCommandMetadata('commandMetadata.suggestions.subcommands.deny.description'))
                .addStringOption(option => option.setName('id').setDescription(getCommandMetadata('commandMetadata.suggestions.subcommands.deny.options.id.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('send')
                .setDescription(getCommandMetadata('commandMetadata.suggestions.subcommands.send.description'))
                .addStringOption(option => option.setName('suggestion').setDescription(getCommandMetadata('commandMetadata.suggestions.subcommands.send.options.suggestion.description')).setRequired(true))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.suggestions',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
