const { CommandInteraction, Client } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const { getCommandMetadata } = require('../../handlers/i18n');

const Schema = require("../../database/models/music");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(getCommandMetadata('commandMetadata.famille.name'))
        .setDescription(getCommandMetadata('commandMetadata.famille.description'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription(getCommandMetadata('commandMetadata.famille.subcommands.help.description'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('adopter')
                .setDescription(getCommandMetadata('commandMetadata.famille.subcommands.adopter.description'))
                .addUserOption(option => option.setName('membre').setDescription(getCommandMetadata('commandMetadata.famille.subcommands.adopter.options.membre.description')).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('supprimer')
                .setDescription(getCommandMetadata('commandMetadata.famille.subcommands.supprimer.description')),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('renier')
                .setDescription(getCommandMetadata('commandMetadata.famille.subcommands.renier.description'))
                .addUserOption(option => option.setName('membre').setDescription(getCommandMetadata('commandMetadata.famille.subcommands.renier.options.membre.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('divorcer')
                .setDescription(getCommandMetadata('commandMetadata.famille.subcommands.divorcer.description'))
                .addUserOption(option => option.setName('membre').setDescription(getCommandMetadata('commandMetadata.famille.subcommands.divorcer.options.membre.description')).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('voir')
                .setDescription(getCommandMetadata('commandMetadata.famille.subcommands.voir.description'))
                .addUserOption(option => option.setName('membre').setDescription(getCommandMetadata('commandMetadata.famille.subcommands.voir.options.membre.description')).setRequired(false)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('marier')
                .setDescription(getCommandMetadata('commandMetadata.famille.subcommands.marier.description'))
                .addUserOption(option => option.setName('membre').setDescription(getCommandMetadata('commandMetadata.famille.subcommands.marier.options.membre.description')).setRequired(true)),
        ),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    localizationKey: 'commandMetadata.famille',

    run: async (client, interaction, args) => {
        await interaction.deferReply();
        client.loadSubcommands(client, interaction, args);
    },
};

 
