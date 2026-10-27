const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thanks')
        .setDescription(getCommandMetadata('commandMetadata.thanks.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.thanks.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription(getCommandMetadata('commandMetadata.thanks.subcommands.check.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.thanks.subcommands.check.options.user.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('thanks')
                .setDescription(getCommandMetadata('commandMetadata.thanks.subcommands.thanks.description'))
                .addUserOption(option => option.setName('user').setDescription(getCommandMetadata('commandMetadata.thanks.subcommands.thanks.options.user.description')).setRequired(true))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.thanks',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
