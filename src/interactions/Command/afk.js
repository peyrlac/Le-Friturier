const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

const Schema = require("../../database/models/music");

module.exports = {
    localizationKey: 'commandMetadata.afk',
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.afk.name'))
        .setDescription(getCommandMetadata('commandMetadata.afk.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.afk.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription(getCommandMetadata('commandMetadata.afk.subcommands.set.description'))
                .addStringOption(option => option.setName('reason').setDescription(getCommandMetadata('commandMetadata.afk.subcommands.set.options.reason.description')))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription(getCommandMetadata('commandMetadata.afk.subcommands.list.description'))
        )
    ,

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
